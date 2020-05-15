import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import { cn } from '../../utils/bem-css-module';
import s from './Icon.scss';

type IconSize = 'xs' | 's' | 'm';

type IconType =
    | 'gamepad'
    | 'gamepadWhite'
    | 'ingots'
    | 'ingotsWhite'
    | 'play'
    | 'playWhite'
    | 'user'
    | 'lightning'
    | 'rub'
    | 'cardsCut'
    | 'ingotsCut'
    | 'playRedCut'
    | 'guard'
    | 'diamond'
    | 'sword'
    | 'dice'
    | 'automat'
    | 'scissors'
    | 'wheel'
    | 'cards'
    | 'cube'
    | 'faq'
    | 'swordWhite'
    | 'diceWhite'
    | 'automatWhite'
    | 'scissorsWhite'
    | 'wheelWhite'
    | 'cardsWhite'
    | 'cubeWhite'
    | 'faqWhite'
    | 'plusWhite'
    | 'prize'
    | 'bell'
    | 'message'
    | 'prizeWhite'
    | 'bellWhite'
    | 'messageWhite'
    | 'signOut'
    | 'smile';

export interface IconProps {
    type: IconType;
    hover?: IconType;
    size?: IconSize;

    className?: string;
}

const cnIcon = cn(s, 'Icon');

const Icon: React.FC<IconProps> = ({ type, hover, size = 's', className }) => {
    useStyles(s);

    return <i className={cnIcon({ type, hover, size }, [className])} />;
};

export default Icon;
