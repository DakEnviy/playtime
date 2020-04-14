import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import { cn } from '../../utils/bem-css-module';
import WelcomeHeader from './Header/WelcomeHeader';
import s from './Welcome.scss';

interface WelcomeProps {}

const cnWelcome = cn(s, 'Welcome');

const Welcome: React.FC<WelcomeProps> = () => {
    useStyles(s);

    return (
        <div className={cnWelcome()}>
            <WelcomeHeader />
        </div>
    );
};

export default Welcome;
