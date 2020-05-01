import React from 'react';

import { RouteResult } from '../../router';
import Layout31 from '../../components/Layout/containers/Layout31';

const action = (): RouteResult => {
    return {
        title: 'Battle page',
        chunks: ['battle'],
        pageContent: (
            <Layout31 leftContent="Battle page" middleContent="Middle" rightContent="Right" bottomContent="Bottom" />
        ),
    };
};

export default action;
