import React from 'react';

import Home from './Home';

async function action() {
    return {
        title: 'Home page',
        chunks: ['home'],
        component: <Home />,
    };
}

export default action;
