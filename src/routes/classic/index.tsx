import React from 'react';

import { RouteResult } from '../../router';
import Layout31 from '../../components/Layout/containers/Layout31';

const action = (): RouteResult => {
    return {
        title: 'Classic page',
        chunks: ['classic'],
        pageContent: <Layout31 leftContent="Left" middleContent="Middle" rightContent="Right" bottomContent="Bottom" />,
    };
};

export default action;
