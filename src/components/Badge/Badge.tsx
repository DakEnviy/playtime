import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './Badge.scss';
import { cn } from '../../utils/bem-css-module';
import Text, { TextProps } from '../Text/Text';

type BadgeColor = 'yellow' | 'pink' | 'red' | 'blue' | 'aqua' | 'green' | 'silver' | 'bronze' | 'gold';

export interface BadgeProps {
    color: BadgeColor;

    className?: string;
    children: TextProps['children'];
}

const cnBadge = cn(s, 'Badge');

const Badge: React.FC<BadgeProps> = ({ color, className, children }) => {
    useStyles(s);

    return (
        <div className={cnBadge({ color }, [className])}>
            <Text className={cnBadge('Value')} size="m">
                {children}
            </Text>
        </div>
    );
};

export default Badge;
