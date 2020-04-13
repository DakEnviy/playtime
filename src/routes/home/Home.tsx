import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import { cn } from '../../utils/bem-css-module';
import Text from '../../components/Text/Text';
import s from './Home.scss';

interface HomeProps {}

const cnHome = cn(s, 'Home');

const Home: React.FC<HomeProps> = () => {
    useStyles(s);

    return (
        <div className={cnHome()}>
            <Text size="xxl" weight="semiBold" className={cnHome('Text')}>
                Home
            </Text>
        </div>
    );
};

export default Home;
