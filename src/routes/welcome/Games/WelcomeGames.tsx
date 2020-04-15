import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './WelcomeGames.scss';
import { cn } from '../../../utils/bem-css-module';
import Title from '../../../components/Title/Title';
import Icon from '../../../components/Icon/Icon';
import Scroller from '../../../components/Scroller/Scroller';
import WelcomeGamesItem from './GamesItem/WelcomeGamesItem';

export interface WelcomeGamesProps {}

const cnWelcomeGames = cn(s, 'WelcomeGames');

const WelcomeGames: React.FC<WelcomeGamesProps> = () => {
    useStyles(s);

    return (
        <section className={cnWelcomeGames()}>
            <div className={cnWelcomeGames('Head')}>
                <Title type="h2">
                    <span>Сыграйте</span> в наши лучшие игры
                </Title>
                <Icon className={cnWelcomeGames('Icon')} type="cardsCut" />
            </div>
            <Scroller className={cnWelcomeGames('List')}>
                <WelcomeGamesItem
                    title="DICE"
                    description="Восприятие, как принято считать, осознает эскапизм, что лишний раз подтверждает правоту З.Фрейда."
                    type="dice"
                />
                <WelcomeGamesItem
                    title="Fast"
                    description="Самонаблюдение, исходя из того, что представляет собой субъект. Аутотренинг выбирает стресс."
                    type="fast"
                />
                <WelcomeGamesItem
                    title="KNB"
                    description="Эпитет интуитивно понятен. Идея самоценности искусства, на первый вгляд, вызывает реализм."
                    type="knb"
                />
                <WelcomeGamesItem
                    title="Battle"
                    description="Восприятие, как принято считать, осознает эскапизм, что лишний раз подтверждает правоту З.Фрейда."
                    type="battle"
                />
            </Scroller>
        </section>
    );
};

export default WelcomeGames;
