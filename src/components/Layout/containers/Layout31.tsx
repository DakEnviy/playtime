import React from 'react';
// import useStyles from 'isomorphic-style-loader/useStyles';

// import s from './Layout31.scss';
// import { cn } from '../../../utils/bem-css-module';
import Layout from '../Layout';

export interface Layout31Props {
    leftContent: React.ReactNode;
    middleContent: React.ReactNode;
    rightContent: React.ReactNode;
    bottomContent: React.ReactNode;
}

// const cnLayout31 = cn(s, 'Layout31');

const Layout31: React.FC<Layout31Props> = ({ leftContent }) => {
    // useStyles(s);

    return <Layout>{leftContent}</Layout>;
};

export default Layout31;
