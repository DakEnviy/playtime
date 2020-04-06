import UniversalRouter, { Options, QueryParams } from 'universal-router';
import { ReactNode } from 'react';

import routes from './routes';

export interface AppRouterContext {}

export interface RouteResult {
    title?: string;
    description?: string;
    component?: ReactNode;

    params?: QueryParams;
    redirect?: string;
    status?: number;

    chunk?: string;
    chunks?: string[];
}

const options: Options<AppRouterContext, RouteResult> = {
    resolveRoute(context, params) {
        if (typeof context.route.load === 'function') {
            return context.route
                .load()
                .then(action => action.default(context, params))
                .then(route => ({ ...route, params }));
        }
        if (typeof context.route.action === 'function') {
            return context.route.action(context, params);
        }
        return undefined;
    },
};

const router = new UniversalRouter(routes, options);

export default router;
