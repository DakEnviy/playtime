/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
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

import { AppContextTypes } from './context';
import createApolloClient from './core/createApolloClient/createApolloClient.server';
import App from './components/App';
import Html, { HtmlProps } from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import passport from './passport';
import router from './router';
import db from './data/database';
// import assets from './asset-manifest.json'; // eslint-disable-line import/no-unresolved
// @ts-ignore
import chunks from './chunk-manifest.json'; // eslint-disable-line import/no-unresolved
import config from './config';
import AppModule from './data/modules/app';

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
// https://github.com/graphql/express-graphql#options

const server = new ApolloServer({
    schema: AppModule.schema,
    uploads: false,
    introspection: __DEV__,
    playground: __DEV__
        ? {
              settings: {
                  'request.credentials': 'include',
              },
          }
        : false,
    debug: __DEV__,
    tracing: __DEV__,
    context: ({ req, res }) => ({
        req,
        res,
        user: req.user,
    }),
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

        const apolloClient = createApolloClient(
            {
                schema: AppModule.schema,
                // This is a context consumed in GraphQL Resolvers
                context: {
                    req,
                    res,
                    user: req.user,
                },
            },
            {},
        );

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

        const data: HtmlProps = { ...route };
        const rootComponent = (
            <App context={context} client={apolloClient} insertCss={insertCss}>
                {route.component}
            </App>
        );
        await getDataFromTree(rootComponent);
        data.children = await ReactDOM.renderToString(rootComponent);
        data.styles = [{ id: 'css', cssText: [...css].join('') }];

        const scripts = new Set<string>();
        const addChunk = (chunk: string) => {
            if (chunks[chunk]) {
                chunks[chunk].forEach((asset: string) => scripts.add(asset));
            } else if (__DEV__) {
                throw new Error(`Chunk with name '${chunk}' cannot be found`);
            }
        };
        addChunk('client');
        if (route.chunk) addChunk(route.chunk);
        if (route.chunks) route.chunks.forEach(addChunk);

        data.scripts = Array.from(scripts);
        data.app = {
            apiUrl: config.api.clientUrl,

            // To restore apollo cache in client.js
            cache: apolloClient.extract(),
        };

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
            {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
        </Html>,
    );
    res.status(err.status || 500);
    res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
const promise = db.sequelize.sync().catch((err: Error) => console.error(err.stack));
if (!module.hot) {
    promise.then(() => {
        app.listen(config.port, () => {
            console.info(`The server is running at http://localhost:${config.port}/`);
        });
    });
}

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
    module.hot.accept('./router');
}

export const { hot } = module;
export default app;
