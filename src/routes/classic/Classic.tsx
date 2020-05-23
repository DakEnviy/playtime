import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './Classic.scss';
import { cn } from '../../utils/bem-css-module';
import Layout31WithChat from '../../components/Layout/containers/Layout31WithChat';
import Panel from '../../components/Panel/Panel';
import Text from '../../components/Text/Text';
import Icon from '../../components/Icon/Icon';
import BetsTable from './BetsTable/BetsTable';
import HistoryTable from './HistoryTable/HistoryTable';

const bets = [
    {
        id: '1',
        user: {
            id: '1',
            username: 'Mr. CatMr. CatMr. CatMr. CatMr. Cat',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        amount: 228,
        chance: 4,
    },
    {
        id: '2',
        user: {
            id: '1',
            username: 'Mr. Cat',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        amount: 228,
        chance: 14,
    },
    {
        id: '3',
        user: {
            id: '1',
            username: 'Mr. Cat',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        amount: 228,
        chance: 39,
    },
    {
        id: '4',
        user: {
            id: '1',
            username: 'Mr. Cat',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        amount: 228,
        chance: 59,
    },
    {
        id: '5',
        user: {
            id: '1',
            username: 'Mr. Cat',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        amount: 228,
        chance: 79,
    },
    {
        id: '6',
        user: {
            id: '1',
            username: 'Mr. Cat',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        amount: 228,
        chance: 99,
    },
    {
        id: '7',
        user: {
            id: '1',
            username: 'Mr. Cat',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        amount: 228,
        chance: 99,
    },
    {
        id: '8',
        user: {
            id: '1',
            username: 'Mr. Cat',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        amount: 228,
        chance: 99,
    },
    {
        id: '9',
        user: {
            id: '1',
            username: 'Mr. Cat',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        amount: 228,
        chance: 99,
    },
];

const history = [
    {
        gameId: '1',
        winner: {
            id: '1',
            username: 'Mr. CatMr. CatMr. CatMr. CatMr. Cat',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        betsAmount: 228,
        fund: 228,
        chance: 4,
        time: '25.10.2019 в 21:46',
    },
    {
        gameId: '2',
        winner: {
            id: '1',
            username: 'Mr. Cat.',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        betsAmount: 228,
        fund: 228,
        chance: 4,
        time: '25.10.2019 в 21:46',
    },
    {
        gameId: '3',
        winner: {
            id: '1',
            username: 'Mr. Cat.',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        betsAmount: 228,
        fund: 228,
        chance: 4,
        time: '25.10.2019 в 21:46',
    },
    {
        gameId: '4',
        winner: {
            id: '1',
            username: 'Mr. Cat.',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        betsAmount: 228,
        fund: 228,
        chance: 4,
        time: '25.10.2019 в 21:46',
    },
    {
        gameId: '5',
        winner: {
            id: '1',
            username: 'Mr. Cat.',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        betsAmount: 228,
        fund: 228,
        chance: 4,
        time: '25.10.2019 в 21:46',
    },
    {
        gameId: '6',
        winner: {
            id: '1',
            username: 'Mr. Cat.',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        betsAmount: 228,
        fund: 228,
        chance: 4,
        time: '25.10.2019 в 21:46',
    },
    {
        gameId: '7',
        winner: {
            id: '1',
            username: 'Mr. Cat.',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        betsAmount: 228,
        fund: 228,
        chance: 4,
        time: '25.10.2019 в 21:46',
    },
    {
        gameId: '8',
        winner: {
            id: '1',
            username: 'Mr. Cat.',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        betsAmount: 228,
        fund: 228,
        chance: 4,
        time: '25.10.2019 в 21:46',
    },
    {
        gameId: '9',
        winner: {
            id: '1',
            username: 'Mr. Cat.',
            avatar:
                'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
        },
        betsAmount: 228,
        fund: 228,
        chance: 4,
        time: '25.10.2019 в 21:46',
    },
];

const cnClassic = cn(s, 'Classic');

const Classic: React.FC = () => {
    useStyles(s);

    return (
        <Layout31WithChat
            leftContent={
                <Panel
                    className={cnClassic('BetsPanel')}
                    leftHead={
                        <Text className={cnClassic('BetsTitle')} font="Rubik" size="l" color="white" upper>
                            Ставки
                        </Text>
                    }
                    rightHead={<Icon type="guard" />}
                >
                    <BetsTable items={bets} />
                </Panel>
            }
            rightContent="Блок с игрой"
            bottomContent={
                <Panel
                    leftHead={
                        <Text className={cnClassic('HistoryTitle')} font="Rubik" size="l" color="white" upper>
                            Последние игры
                        </Text>
                    }
                >
                    <HistoryTable items={history} />
                </Panel>
            }
        />
    );
};

export default Classic;
