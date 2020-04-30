import 'reflect-metadata'; // To enable reflection
import path from 'path';
import { createServer } from 'http';
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
import jwt from 'jsonwebtoken';
import React from 'react';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import { ApolloServer } from 'apollo-server-express';
import { getDataFromTree } from 'react-apollo';
import depthLimit from 'graphql-depth-limit';

import { AppContextTypes } from './context';
import createApolloClient from './utils/apollo/createApolloClient.server';
import App from './components/App';
import Html, { HtmlProps } from './components/Html';
import { ErrorPage } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.scss';
import passport from './passport';
import router from './router';
import { database } from './data/database';
import AppModule from './data/modules/app';
import rateLimiterMiddleware from './utils/middlewares/rateLimiterRedis';
import { createContext, createWebSocketContext } from './utils/apollo/createContext';
// import assets from './asset-manifest.json'; // eslint-disable-line import/no-unresolved
// @ts-ignore
import chunks from './chunk-manifest.json'; // eslint-disable-line import/no-unresolved
import config from './config';

process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p, 'reason:', reason);
    // send entire app down. Process manager will restart it
    process.exit(1);
});

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
// @ts-ignore
global.navigator = global.navigator || {};
// @ts-ignore
global.navigator.userAgent = global.navigator.userAgent || 'all';

const app = express();

//
// If you are using proxy from external machine, you can set TRUST_PROXY env
// Default is to trust proxy headers only from loopback interface.
// -----------------------------------------------------------------------------
app.set('trust proxy', config.trustProxy);

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Enable rate-limit
// -----------------------------------------------------------------------------
app.use(rateLimiterMiddleware());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(
    expressJwt({
        secret: config.auth.jwt.secret,
        credentialsRequired: false,
        getToken: req => req.cookies[config.auth.tokenKey],
    }),
);
// Error handler for express-jwt
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-line no-unused-vars
    if (err instanceof Jwt401Error) {
        console.error('[express-jwt-error]', req.cookies[config.auth.tokenKey]);
        // `clearCookie`, otherwise user can't use web-app until cookie expires
        res.clearCookie(config.auth.tokenKey);
    }
    next(err);
});

app.use(passport.initialize());

// Vk authentication
app.get(
    '/auth/vk',
    passport.authenticate('vkontakte', {
        failureRedirect: '/',
        session: false,
    }),
);
app.get(
    '/auth/vk/return',
    passport.authenticate('vkontakte', {
        failureRedirect: '/',
        session: false,
    }),
    (req, res) => {
        const expiresIn = 60 * 60 * 24 * 180; // 180 days
        const token = jwt.sign(req.user!, config.auth.jwt.secret, { expiresIn });
        res.cookie(config.auth.tokenKey, token, { maxAge: 1000 * expiresIn, httpOnly: true });
        res.redirect('/');
    },
);
// Logout endpoint
app.get('/logout', (_0, res) => {
    res.clearCookie(config.auth.tokenKey);
    res.redirect('/');
});

//
// Register API middleware
// -----------------------------------------------------------------------------
// https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-express

const server = new ApolloServer({
    schema: AppModule.schema,
    uploads: false,
    introspection: __DEV__,
    debug: __DEV__,
    tracing: __DEV__,
    playground: __DEV__
        ? {
              settings: {
                  'request.credentials': 'include',
              },
              subscriptionEndpoint: 'ws://localhost:3002/graphql',
          }
        : false,
    validationRules: [depthLimit(5)],
    context: ({ req, res }) => createContext(req, res),
    subscriptions: {
        onConnect: connectionParams => createWebSocketContext(connectionParams),
    },
});
server.applyMiddleware({ app });

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
    try {
        const css = new Set();

        // Enables critical path CSS rendering
        // https://github.com/kriasoft/isomorphic-style-loader
        const insertCss = (...styles: { _getCss(): string }[]) => {
            // eslint-disable-next-line no-underscore-dangle
            styles.forEach(style => css.add(style._getCss()));
        };

        const apolloClient = createApolloClient({
            schema: AppModule.schema,
            context: await createContext(req, res),
        });

        // Global (context) variables that can be easily accessed from any React component
        // https://facebook.github.io/react/docs/context.html
        const context: AppContextTypes = {
            // The twins below are wild, be careful!
            pathname: req.path,
            query: req.query,
        };

        const route = await router.resolve(context);

        context.params = route.params;

        if (route.redirect) {
            res.redirect(route.status || 302, route.redirect);
            return;
        }

        const rootComponent = (
            <App client={apolloClient} context={context} insertCss={insertCss}>
                {route.component}
            </App>
        );
        await getDataFromTree(rootComponent);

        const scripts = new Set<string>();
        const addChunk = (chunk: string) => {
            if (chunks[chunk]) {
                chunks[chunk].forEach((asset: string) => scripts.add(asset));
            } else if (__DEV__) {
                throw new Error(`Chunk with name '${chunk}' cannot be found`);
            }
        };
        addChunk('client');
        addChunk('polyfills');
        if (route.chunk) addChunk(route.chunk);
        if (route.chunks) route.chunks.forEach(addChunk);

        const data: HtmlProps = {
            title: route.title!,
            description: route.description!,
            children: ReactDOM.renderToString(rootComponent),
            styles: [{ id: 'css', cssText: [...css].join('') }],
            scripts: Array.from(scripts),
            app: {
                apiUrl: config.api.clientUrl,

                // To restore apollo cache in client.js
                cache: apolloClient.extract(),
            },
        };

        // noinspection RequiredAttributes
        const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
        res.status(route.status || 200);
        res.send(`<!doctype html>${html}`);
    } catch (err) {
        next(err);
    }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, _0: Request, res: Response, _next: NextFunction) => {
    console.error(pe.render(err));
    const html = ReactDOM.renderToStaticMarkup(
        <Html
            app={{}}
            title="Internal Server Error"
            description={err.message}
            styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
        >
            {ReactDOM.renderToString(<ErrorPage error={err} />)}
        </Html>,
    );
    res.status(err.status || 500);
    res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
app.server = createServer(module.hot ? undefined : app);
server.installSubscriptionHandlers(app.server);

const port = module.hot ? config.devPort : config.port;
const dbSync = database.sequelize.sync().catch((err: Error) => console.error(err.stack));

dbSync.then(() => {
    app.server.listen(port, () => {
        console.info(
            module.hot
                ? `The development server is running at http://localhost:${port}/`
                : `The server is running at http://localhost:${port}/`,
        );
    });
});

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
    // noinspection JSIgnoredPromiseFromCall
    module.hot.accept('./router');
}

export const { hot } = module;
export default app;
