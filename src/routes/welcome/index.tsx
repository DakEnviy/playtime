import React from 'react';

import { RouteResult } from '../../router';
import Welcome from './Welcome';

const action = (): RouteResult => {
    return {
        title: 'Welcome page',
        chunks: ['welcome'],
        pageContent: <Welcome />,
    };
};

export default action;
