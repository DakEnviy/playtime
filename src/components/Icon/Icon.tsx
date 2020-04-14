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
    | 'diamondWhite';

export interface IconProps {
    size?: IconSize;
    type: IconType;
}

const cnIcon = cn(s, 'Icon');

const Icon: React.FC<IconProps> = ({ size = 's', type }) => {
    useStyles(s);

    return <i className={cnIcon({ type, size })} />;
};

export default Icon;
