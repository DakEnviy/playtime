import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './Home.scss';

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
    useStyles(s);

    return <div className={s.root}>Home</div>;
};

export default Home;
