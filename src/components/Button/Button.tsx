import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './Button.scss';
import { cn } from '../../utils/bem-css-module';
import Icon, { IconProps } from '../Icon/Icon';

type ButtonShape = 'right' | 'left' | 'alphaRight';
type ButtonColor = 'blue' | 'green' | 'gray' | 'bordered';
type ButtonSize = 'xs' | 's' | 'm';
type ButtonWeight = 'normal' | 'semiBold' | 'bold';

export interface ButtonProps {
    shape?: ButtonShape;
    color?: ButtonColor;
    size?: ButtonSize;
    weight?: ButtonWeight;
    upper?: boolean;
    submit?: boolean;
    icon?: IconProps['type'];
    iconHover?: IconProps['hover'];
    iconSize?: IconProps['size'];
    clear?: boolean;

    onClick?: () => void;

    className?: string;
    children?: React.ReactText;
}

/** TODO: remove this
 * 44 x 18 ?
 * 60 x 35
 * 85 x 40 - with icon
 * 125 x 33
 * 140 x 55 ?
 * 165 x 40
 * 180 x 55 ?
 * 190 x 45 ?
 * 200 x 50 ?
 */

const cnButton = cn(s, 'Button');

const Button: React.FC<ButtonProps> = ({
    shape = 'right',
    color = 'blue',
    size = 's',
    weight = 'bold',
    upper,
    submit,
    icon,
    iconHover,
    iconSize,
    clear,
    onClick,
    className,
    children,
}) => {
    useStyles(s);

    return (
        // eslint-disable-next-line react/button-has-type
        <button
            className={cnButton(clear ? null : { shape, color, size, weight, upper }, [className])}
            type={submit ? 'submit' : 'button'}
            onClick={onClick}
        >
            {icon ? (
                <Icon
                    className={cnButton('Icon', { withHover: Boolean(iconHover) })}
                    type={icon}
                    hover={iconHover}
                    size={iconSize}
                />
            ) : (
                <span className={cnButton('Text')}>{children}</span>
            )}
        </button>
    );
};

export default Button;
