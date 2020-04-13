import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import { cn } from '../../utils/bem-css-module';
import s from './Text.scss';

type TextFont = 'OpenSans' | 'Rubik';
type TextSize = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
type TextLine = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
type TextStyle = 'regular' | 'semiBold' | 'bold';

export interface TextProps {
    font?: TextFont;
    size?: TextSize;
    line?: TextLine;
    weight?: TextStyle;
    italic?: boolean;
    semantic?: boolean;

    className?: string;
    children: React.ReactText;
}

const cnText = cn(s, 'Text');

const Text: React.FC<TextProps> = ({
    font = 'OpenSans',
    size = 's',
    line = 's',
    weight = 'bold',
    italic,
    semantic,
    className: mixClassName,
    children,
}) => {
    useStyles(s);

    const className = cnText({ font, size, line, weight, italic }, [mixClassName]);
    let elem: React.ReactNode = children;

    if (semantic) {
        if (italic) {
            elem = <em>{elem}</em>;
        }

        if (weight === 'semiBold' || weight === 'bold') {
            return <strong className={className}>{elem}</strong>;
        }
    }

    return <span className={className}>{elem}</span>;
};

export default Text;
