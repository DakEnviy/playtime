import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './LiveFeedTable.scss';
import { cn } from '../../../../utils/bem-css-module';
import Column from '../../../../components/Table/Column/Column';
import SafeTable from '../../../../components/Table/containers/SafeTable';
import Text from '../../../../components/Text/Text';
import Icon, { IconProps } from '../../../../components/Icon/Icon';
import ChanceBadge from '../../../../components/Badge/containers/ChanceBadge';

type LiveFeedItemGame = 'battle' | 'dice' | 'knb';

interface LiveFeedItem {
    id: number;
    game: LiveFeedItemGame;
    winner: string;
    chance: number;
    fund: number;
    time: string;
}

export interface LiveFeedTableProps {
    items: LiveFeedItem[];
}

const cnLiveFeedTable = cn(s, 'LiveFeedTable');

// @ts-ignore TS не видит, что функция не может вернуть undefined
// eslint-disable-next-line consistent-return
const getIcon = (game: LiveFeedItemGame): IconProps['type'] => {
    if (game === 'battle') return 'sword';
    if (game === 'dice') return 'dice';
    if (game === 'knb') return 'scissors';
};

const LiveFeedTable: React.FC<LiveFeedTableProps> = ({ items }) => {
    useStyles(s);

    return (
        <SafeTable<LiveFeedItem, 'id'> className={cnLiveFeedTable()} rowKey="id" items={items}>
            <Column<LiveFeedItem>
                label={
                    <Text weight="semiBold" upper>
                        Игра
                    </Text>
                }
                minWidth={100}
                columnKey="game"
            >
                {({ game }) => (
                    <>
                        <Icon className={cnLiveFeedTable('GameIcon')} type={getIcon(game)} />
                        <Text className={cnLiveFeedTable('GameName')} font="Rubik" color="white" upper>
                            {game}
                        </Text>
                        <Icon className={cnLiveFeedTable('FairIcon')} type="guard" />
                    </>
                )}
            </Column>
            <Column<LiveFeedItem>
                label={
                    <Text weight="semiBold" upper>
                        Победитель
                    </Text>
                }
                minWidth={150}
                columnKey="winner"
            >
                {({ winner }) => (
                    <>
                        <div className={cnLiveFeedTable('WinnerAvatar')} />
                        <Text className={cnLiveFeedTable('WinnerName')} color="white" upper>
                            {winner}
                        </Text>
                    </>
                )}
            </Column>
            <Column<LiveFeedItem>
                label={
                    <Text weight="semiBold" upper>
                        Шанс
                    </Text>
                }
                minWidth={80}
                columnKey="chance"
            >
                {({ chance }) => <ChanceBadge chance={chance} />}
            </Column>
            <Column<LiveFeedItem>
                label={
                    <Text weight="semiBold" upper>
                        Выигрыш
                    </Text>
                }
                minWidth={100}
                columnKey="fund"
            >
                {({ fund }) => (
                    <>
                        <Text className={cnLiveFeedTable('FundAmount')} font="Rubik" color="white" upper>
                            {fund}
                        </Text>
                        <Icon className={cnLiveFeedTable('FundIcon')} type="diamondWhite" />
                    </>
                )}
            </Column>
            <Column<LiveFeedItem>
                label={
                    <Text weight="semiBold" upper>
                        Время
                    </Text>
                }
                minWidth={120}
                columnKey="time"
            >
                {({ time }) => (
                    <Text color="white" upper>
                        {time}
                    </Text>
                )}
            </Column>
        </SafeTable>
    );
};

export default LiveFeedTable;