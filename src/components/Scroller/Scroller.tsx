import React, { useState } from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './Scroller.scss';
import { cn } from '../../utils/bem-css-module';

export interface ScrollerProps {
    className?: string;
    children: React.ReactNode;
}

const cnScroller = cn(s, 'Scroller');

const Scroller: React.FC<ScrollerProps> = ({ children, className }) => {
    useStyles(s);

    const [isDragging, setDragging] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const viewport = React.useRef<HTMLDivElement | null>(null);

    const onDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
        setDragging(true);
        setPosition({ x: e.clientX, y: e.clientY });
    };

    const onDragEnd = () => setDragging(false);

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isDragging && viewport.current) {
            viewport.current.scrollLeft -= e.clientX - position.x;
            viewport.current.scrollTop -= e.clientY - position.y;
            setPosition({ x: e.clientX, y: e.clientY });
        }
    };

    return (
        <div className={cnScroller(null, [className])}>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
                className={cnScroller('Viewport')}
                ref={viewport}
                onMouseDown={onDragStart}
                onMouseUp={onDragEnd}
                onMouseLeave={onDragEnd}
                onMouseMove={onMouseMove}
            >
                <div className={cnScroller('Items')}>{children}</div>
            </div>
        </div>
    );
};

export default Scroller;
