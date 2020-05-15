import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './BetsTable.scss';
import { cn } from '../../../utils/bem-css-module';
import SafeTable from '../../../components/Table/containers/SafeTable';
import Column from '../../../components/Table/Column/Column';
import Text from '../../../components/Text/Text';
import TextIcon from '../../../components/TextIcon/TextIcon';
import ChanceBadge from '../../../components/Badge/containers/ChanceBadge';

interface BetsItem {
    id: string;
    user: { id: string; username: string; avatar: string };
    amount: number;
    chance: number;
}

export interface BetsTableProps {
    items: BetsItem[];
}

const cnBetsTable = cn(s, 'BetsTable');

const BetsTable: React.FC<BetsTableProps> = ({ items }) => {
    useStyles(s);

    return (
        <SafeTable<BetsItem, 'id'> className={cnBetsTable()} rowKey="id" items={items}>
            <Column<BetsItem>
                label={
                    <Text weight="semiBold" upper>
                        Игрок
                    </Text>
                }
                minWidth={100}
                columnKey="user"
            >
                {({ user }) => (
                    <>
                        <img className={cnBetsTable('UserAvatar')} src={user.avatar} alt={user.username} />
                        <Text className={cnBetsTable('UserName')} color="white" upper>
                            {user.username}
                        </Text>
                    </>
                )}
            </Column>
            <Column<BetsItem>
                label={
                    <Text weight="semiBold" upper>
                        Сумма
                    </Text>
                }
                minWidth={75}
                maxWidth={110}
                columnKey="amount"
            >
                {({ amount }) => <TextIcon text={amount} icon="diamond" color="white" upper />}
            </Column>
            <Column<BetsItem>
                label={
                    <Text weight="semiBold" upper>
                        Шанс
                    </Text>
                }
                minWidth={85}
                maxWidth={100}
                columnKey="chance"
            >
                {({ chance }) => <ChanceBadge chance={chance} />}
            </Column>
        </SafeTable>
    );
};

export default BetsTable;
