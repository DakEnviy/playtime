import React from 'react';

import { RouteResult } from '../../router';
import Classic from './Classic';

const action = (): RouteResult => {
    return {
        title: 'Classic page',
        chunks: ['classic'],
        pageContent: <Classic />,
    };
};

export default action;
