import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './NavigationItem.scss';
import { cn } from '../../../../utils/bem-css-module';
import Link, { LinkProps } from '../../../../components/Link/Link';
import Text, { TextProps } from '../../../../components/Text/Text';
import Icon, { IconProps } from '../../../../components/Icon/Icon';

interface NavigationItemProps {
    to: LinkProps['to'];
    text: TextProps['children'];
    icon: IconProps['type'];
}

const cnNavigationItem = cn(s, 'NavigationItem');

const NavigationItem: React.FC<NavigationItemProps> = ({ to, text, icon }) => {
    useStyles(s);

    return (
        <Link className={cnNavigationItem()} to={to}>
            <Icon type={icon} />
            <Text className={cnNavigationItem('Text')}>{text}</Text>
        </Link>
    );
};

export default NavigationItem;
