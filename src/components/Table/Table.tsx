import React, { useMemo, useRef } from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './Table.scss';
import { cn } from '../../utils/bem-css-module';
import useColumns from '../../hooks/useColumns';
import { ColumnElement } from './Column/Column';

export type GetRowKey<T> = (item: T, index: number) => React.Key;

type GetRowClassName<T> = (item: T, index: number) => string | string[];

export interface TableProps<
    T extends K extends keyof T ? { [KE in K]: React.Key } : object,
    K extends keyof T | GetRowKey<T> = GetRowKey<T>
> {
    rowKey: K;
    rowClassName?: GetRowClassName<T> | string | string[];
    items: T[];

    className?: string;
    children: ColumnElement<T>[];
}

const cnTable = cn(s, 'Table');

const Table = <
    T extends K extends keyof T ? { [KE in K]: React.Key } : object,
    K extends keyof T | GetRowKey<T> = GetRowKey<T>
>({
    rowKey,
    rowClassName,
    items,
    className,
    children,
}: TableProps<T, K>): React.ReactElement<TableProps<T, K>> => {
    useStyles(s);

    // @ts-ignore Тип K не приводится к keyof T при низлежайшей проверке
    const getRowKey = (typeof rowKey === 'function' ? rowKey : (item: T) => item[rowKey]) as GetRowKey<T>;
    const getRowClassName: GetRowClassName<T> =
        // eslint-disable-next-line no-nested-ternary
        typeof rowClassName === 'undefined'
            ? () => []
            : typeof rowClassName === 'function'
            ? rowClassName // eslint-disable-line prettier/prettier
            : () => rowClassName; // eslint-disable-line prettier/prettier

    const anchor = useRef<HTMLDivElement | null>(null);
    const columns = useMemo(() => children.map(child => child.props), [children]);
    const columnWidths = useColumns(anchor, columns);

    return (
        <div className={cnTable(null, [className])}>
            <div className={cnTable('Content')}>
                <div className={cnTable('Head')}>
                    <div className={cnTable('Anchor')} ref={anchor} />
                    {columns.map((column, index) => (
                        <div
                            className={cnTable('HeadCell')}
                            style={{ width: columnWidths[index] }}
                            key={column.columnKey}
                        >
                            {column.label}
                        </div>
                    ))}
                </div>
                <div className={cnTable('Body')}>
                    {items.map((item, index) => (
                        <div className={cnTable('Row', [...getRowClassName(item, index)])} key={getRowKey(item, index)}>
                            {columns.map((column, columnIndex) => (
                                <div
                                    className={cnTable('RowCell')}
                                    style={{ width: columnWidths[columnIndex] }}
                                    key={column.columnKey}
                                >
                                    {column.children(item, index)}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Table;
