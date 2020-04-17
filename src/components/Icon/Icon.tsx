import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import { cn } from '../../utils/bem-css-module';
import s from './Icon.scss';

type IconSize = 'xs' | 's' | 'm';

type IconType =
    | 'gamepad'
    | 'ingots'
    | 'play'
    | 'user'
    | 'lightning'
    | 'rub'
    | 'cardsCut'
    | 'ingotsCut'
    | 'playRedCut'
    | 'guard'
    | 'diamondWhite'
    | 'sword'
    | 'dice'
    | 'scissors';

export interface IconProps {
    size?: IconSize;
    type: IconType;

    className?: string;
}

const cnIcon = cn(s, 'Icon');

const Icon: React.FC<IconProps> = ({ size = 's', type, className }) => {
    useStyles(s);

    return <i className={cnIcon({ type, size }, [className])} />;
};

export default Icon;
