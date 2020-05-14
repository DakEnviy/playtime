import React from 'react';

import { RouteResult } from '../../router';
import Layout31WithChat from '../../components/Layout/containers/Layout31WithChat';

const action = (): RouteResult => {
    return {
        title: 'Battle page',
        chunks: ['battle'],
        pageContent: <Layout31WithChat leftContent="Battle page" rightContent="Right" bottomContent="Bottom" />,
    };
};

export default action;
