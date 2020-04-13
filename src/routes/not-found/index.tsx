import React from 'react';

import { RouteResult } from '../../router';
import Layout from '../../components/Layout';
import NotFound from './NotFound';

const title = 'Page Not Found';

const action = (): RouteResult => {
    return {
        chunks: ['not-found'],
        title,
        component: (
            <Layout>
                <NotFound title={title} />
            </Layout>
        ),
        status: 404,
    };
};

export default action;
