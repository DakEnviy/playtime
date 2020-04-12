import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';
import normalizeCss from 'normalize.css';

import s from './Page.scss';

interface PageProps {
    children: React.ReactElement;
}

const Page: React.FC<PageProps> = ({ children }) => {
    useStyles(normalizeCss, s);

    return children;
};

export default Page;
