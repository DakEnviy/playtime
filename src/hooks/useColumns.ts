import { MutableRefObject, useLayoutEffect, useState } from 'react';

import useMeasure from './useMeasure';

export interface Column {
    minWidth: number;
    maxWidth?: number;
}

const useColumns = <R extends HTMLElement, C extends Column[]>(
    ref: MutableRefObject<R | null>,
    columns: C,
): number[] => {
    const { width } = useMeasure(ref);
    const [columnWidths, setColumnWidths] = useState(() => columns.map(column => column.minWidth));

    useLayoutEffect(() => {
        let minWidth = 0;
        let maxWidth = 0;
        let maxDelta = 0;
        let unlimitedColumnsCount = 0;
        let unlimitedColumnsMaxWidth = 0;

        columns.forEach(column => {
            minWidth += column.minWidth;

            if (column.maxWidth) {
                maxWidth += column.maxWidth;
                maxDelta = Math.max(maxDelta, column.maxWidth - column.minWidth);
            } else {
                maxWidth += column.minWidth;
                ++unlimitedColumnsCount;
                unlimitedColumnsMaxWidth += column.minWidth;
            }
        });

        maxWidth += unlimitedColumnsCount * maxDelta;
        unlimitedColumnsMaxWidth += unlimitedColumnsCount * maxDelta;

        if (width <= minWidth) return;

        setColumnWidths(
            columns.map(column => {
                if (width <= maxWidth) {
                    const delta = column.maxWidth ? column.maxWidth - column.minWidth : maxDelta;

                    return column.minWidth + (delta / (maxWidth - minWidth)) * (width - minWidth);
                }

                return column.maxWidth
                    ? column.maxWidth
                    : column.minWidth +
                          maxDelta +
                          ((column.minWidth + maxDelta) / unlimitedColumnsMaxWidth) * (width - minWidth);
            }),
        );
    }, [width, columns]);

    return columnWidths;
};

export default useColumns;