import React from 'react';

import WelcomeHeader from './Header/WelcomeHeader';
import WelcomeBanner from './Banner/WelcomeBanner';
import WelcomeGames from './Games/WelcomeGames';

const Welcome: React.FC = () => {
    return (
        <>
            <WelcomeHeader />
            <WelcomeBanner />
            <WelcomeGames />
        </>
    );
};

export default Welcome;
