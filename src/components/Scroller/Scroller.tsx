import React, { useRef } from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './Scroller.scss';
import { cn } from '../../utils/bem-css-module';
import useDragMove from '../../hooks/useDragMove';

export interface ScrollerProps {
    className?: string;
    children: React.ReactNode;
}

const cnScroller = cn(s, 'Scroller');

const Scroller: React.FC<ScrollerProps> = ({ children, className }) => {
    useStyles(s);

    const viewport = useRef<HTMLDivElement | null>(null);

    const onDragStart = useDragMove((dx, dy) => {
        if (!viewport.current) return;

        viewport.current.scrollLeft -= dx;
        viewport.current.scrollTop -= dy;
    }, []);

    return (
        <div className={cnScroller(null, [className])}>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div className={cnScroller('Viewport')} ref={viewport} onMouseDown={onDragStart}>
                <div className={cnScroller('Items')}>{children}</div>
            </div>
        </div>
    );
};

export default Scroller;
