import { MutableRefObject, useLayoutEffect, useMemo, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export interface MeasureSnapshot {
    width: number;
    height: number;
}

const useMeasure = <T extends HTMLElement>(ref: MutableRefObject<T | null>): MeasureSnapshot => {
    const [snapshot, setSnapshot] = useState<MeasureSnapshot>({ width: 0, height: 0 });

    const resizeObserver = useMemo(
        () =>
            new ResizeObserver(entries => {
                const { offsetWidth: width, offsetHeight: height } = entries[0].target as HTMLElement;

                setSnapshot({ width, height });
            }),
        [],
    );

    useLayoutEffect(() => {
        const element = ref.current;

        if (!element) return;

        resizeObserver.observe(element);

        // eslint-disable-next-line consistent-return
        return () => resizeObserver.unobserve(element);
    }, [ref, resizeObserver]);

    return snapshot;
};

export default useMeasure;
