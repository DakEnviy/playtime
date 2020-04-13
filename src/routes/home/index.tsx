import React from 'react';

import { RouteResult } from '../../router';
import Home from './Home';

const action = (): RouteResult => {
    return {
        title: 'Home page',
        chunks: ['home'],
        pageContent: <Home />,
    };
};

export default action;
