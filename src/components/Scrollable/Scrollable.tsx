import React, { useRef, useState } from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './Scrollable.scss';
import { cn } from '../../utils/bem-css-module';
import useDragMove from '../../hooks/useDragMove';
import useElementSize from '../../hooks/useElementSize';
import useIsomorphicLayoutEffect from '../../hooks/useIsomorphicLayoutEffect';

export interface ScrollableProps {
    disablePadding?: boolean;

    className?: string;
    children: React.ReactNode;
}

const cnScrollable = cn(s, 'Scrollable');

const Scrollable: React.FC<ScrollableProps> = ({ disablePadding, className, children }) => {
    useStyles(s);

    const viewportRef = useRef<HTMLDivElement | null>(null);
    const verticalScrollRef = useRef<HTMLDivElement | null>(null);
    const horizontalScrollRef = useRef<HTMLDivElement | null>(null);

    const [{ barWidth, barHeight, barTop, barLeft }, setState] = useState({
        barWidth: 0,
        barHeight: 0,
        barTop: 0,
        barLeft: 0,
    });

    const [{ isVerticalActive, isHorizontalActive }, setActive] = useState({
        isVerticalActive: false,
        isHorizontalActive: false,
    });

    const isVertical = barHeight > 0;
    const isHorizontal = barWidth > 0;

    const { height: scrollBarHeight } = useElementSize(verticalScrollRef, true, [isHorizontal]);
    const { width: scrollBarWidth } = useElementSize(horizontalScrollRef, true, [isVertical]);

    const onDragStartVertical = useDragMove(
        (_0, dy, isDragging) => {
            if (!viewportRef.current) return;

            viewportRef.current.scrollTop += (dy / scrollBarHeight) * viewportRef.current.scrollHeight;
            setActive({
                isVerticalActive: isDragging,
                isHorizontalActive: false,
            });
        },
        [scrollBarHeight],
    );

    const onDragStartHorizontal = useDragMove(
        (dx, _0, isDragging) => {
            if (!viewportRef.current) return;

            viewportRef.current.scrollLeft += (dx / scrollBarWidth) * viewportRef.current.scrollWidth;
            setActive({
                isVerticalActive: false,
                isHorizontalActive: isDragging,
            });
        },
        [scrollBarWidth],
    );

    const updateState = (element: HTMLDivElement) => {
        const { offsetWidth, offsetHeight, scrollWidth, scrollHeight, scrollTop, scrollLeft } = element;

        const newBarWidth = offsetWidth < scrollWidth ? (offsetWidth / scrollWidth) * 100 : 0;
        const newBarHeight = offsetHeight < scrollHeight ? (offsetHeight / scrollHeight) * 100 : 0;

        setState({
            barWidth: newBarWidth,
            barHeight: newBarHeight,
            barTop:
                offsetHeight < scrollHeight ? (scrollTop / (scrollHeight - offsetHeight)) * (100 - newBarHeight) : 0,
            barLeft: offsetWidth < scrollWidth ? (scrollLeft / (scrollWidth - offsetWidth)) * (100 - newBarWidth) : 0,
        });
    };

    const onScroll = (event: React.UIEvent<HTMLDivElement, UIEvent>) => {
        updateState(event.currentTarget);
    };

    useIsomorphicLayoutEffect(() => {
        if (!viewportRef.current) return;

        updateState(viewportRef.current);
    }, [children]);

    return (
        <div className={cnScrollable({ isVertical, isHorizontal }, [className])}>
            <div className={cnScrollable('Viewport', { disablePadding })} ref={viewportRef} onScroll={onScroll}>
                {children}
            </div>
            <div className={cnScrollable('VerticalScroll')} ref={verticalScrollRef}>
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <div
                    className={cnScrollable('VerticalBar', { active: isVerticalActive })}
                    style={{ height: `${barHeight}%`, top: `${barTop}%` }}
                    onMouseDown={onDragStartVertical}
                />
            </div>
            <div className={cnScrollable('HorizontalScroll')} ref={horizontalScrollRef}>
                {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
                <div
                    className={cnScrollable('HorizontalBar', { active: isHorizontalActive })}
                    style={{ width: `${barWidth}%`, left: `${barLeft}%` }}
                    onMouseDown={onDragStartHorizontal}
                />
            </div>
        </div>
    );
};

export default Scrollable;
