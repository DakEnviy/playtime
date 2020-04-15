import React from 'react';

import { RouteResult } from '../../router';
import WelcomeHeader from './Header/WelcomeHeader';
import WelcomeBanner from './Banner/WelcomeBanner';
import WelcomeGames from './Games/WelcomeGames';
import WelcomeCards from './Cards/WelcomeCards';

const action = (): RouteResult => {
    return {
        title: 'Welcome page',
        chunks: ['welcome'],
        pageContent: (
            <>
                <WelcomeHeader />
                <WelcomeBanner />
                <WelcomeGames />
                <WelcomeCards />
            </>
        ),
    };
};

export default action;
