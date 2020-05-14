import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './HistoryTable.scss';
import { cn } from '../../../utils/bem-css-module';
import SafeTable from '../../../components/Table/containers/SafeTable';
import Column from '../../../components/Table/Column/Column';
import Text from '../../../components/Text/Text';
import ChanceBadge from '../../../components/Badge/containers/ChanceBadge';
import TextIcon from '../../../components/TextIcon/TextIcon';
import Icon from '../../../components/Icon/Icon';

interface HistoryItem {
    gameId: string;
    winner: { id: string; username: string; avatar: string };
    betsAmount: number;
    fund: number;
    chance: number;
    time: string;
}

export interface HistoryTableProps {
    items: HistoryItem[];
}

const cnHistoryTable = cn(s, 'HistoryTable');

const HistoryTable: React.FC<HistoryTableProps> = ({ items }) => {
    useStyles(s);

    return (
        <SafeTable<HistoryItem, 'gameId'> className={cnHistoryTable()} rowKey="gameId" items={items}>
            <Column<HistoryItem>
                label={
                    <Text weight="semiBold" upper>
                        Победитель
                    </Text>
                }
                minWidth={200}
                columnKey="winner"
            >
                {({ winner, betsAmount }) => (
                    <>
                        <img className={cnHistoryTable('WinnerAvatar')} src={winner.avatar} alt={winner.username} />
                        <div className={cnHistoryTable('WinnerInfo')}>
                            <Text className={cnHistoryTable('WinnerName')}>{winner.username}</Text>
                            <TextIcon
                                className={cnHistoryTable('BetsAmount')}
                                text={betsAmount}
                                icon="diamondWhite"
                                color="white"
                                upper
                            />
                        </div>
                    </>
                )}
            </Column>
            <Column<HistoryItem>
                label={
                    <Text weight="semiBold" upper>
                        Шанс
                    </Text>
                }
                minWidth={100}
                maxWidth={200}
                columnKey="chance"
            >
                {({ chance }) => <ChanceBadge chance={chance} />}
            </Column>
            <Column<HistoryItem>
                label={
                    <Text weight="semiBold" upper>
                        Выигрыш
                    </Text>
                }
                minWidth={110}
                maxWidth={200}
                columnKey="fund"
            >
                {({ fund }) => <TextIcon text={fund} icon="diamondWhite" color="white" upper />}
            </Column>
            <Column<HistoryItem>
                label={
                    <Text weight="semiBold" upper>
                        Время
                    </Text>
                }
                minWidth={120}
                maxWidth={180}
                columnKey="time"
            >
                {({ time }) => (
                    <Text color="white" upper>
                        {time}
                    </Text>
                )}
            </Column>
            <Column<HistoryItem>
                label={
                    <Text weight="semiBold" upper>
                        Номер игры
                    </Text>
                }
                minWidth={95}
                maxWidth={110}
                columnKey="gameId"
            >
                {({ gameId }) => (
                    <>
                        <Text font="Rubik" color="white" upper>
                            {gameId}
                        </Text>
                        <Icon className={cnHistoryTable('FairButton')} type="guard" />
                    </>
                )}
            </Column>
        </SafeTable>
    );
};

export default HistoryTable;
