import React, { FunctionComponent } from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';
import normalizeCss from 'normalize.css';

import s from './Layout.css';

interface PropTypes {}

const Layout: FunctionComponent<PropTypes> = ({ children }) => {
    useStyles(normalizeCss, s);

    return <div>{children}</div>;
};

export default Layout;
