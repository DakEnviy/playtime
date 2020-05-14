import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './Chat.scss';
import { cn } from '../../utils/bem-css-module';
import ChatMessage, { ChatMessageProps } from './Message/ChatMessage';
import Panel from '../Panel/Panel';
import Text from '../Text/Text';
import Scrollable from '../Scrollable/Scrollable';
import ChatMessageForm from '../forms/ChatMessageForm';

export interface ChatProps {
    messages?: ChatMessageProps[];
    className?: string;
}

const defaultUser: ChatMessageProps['user'] = {
    id: '1',
    username: 'Mr. Cat',
    avatar:
        'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
};

const defaultMessages: ChatMessageProps[] = [
    {
        id: '1',
        user: {
            ...defaultUser,
            username:
                'Mr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.Cat',
        },
        message: 'При\nвет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
        time: '21:32',
    },
    {
        id: '2',
        user: defaultUser,
        message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
        time: '21:32',
    },
    {
        id: '3',
        user: defaultUser,
        message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
        time: '21:32',
    },
    {
        id: '4',
        user: defaultUser,
        message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
        time: '21:32',
    },
    {
        id: '5',
        user: defaultUser,
        message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
        time: '21:32',
    },
    {
        id: '6',
        user: defaultUser,
        message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
        time: '21:32',
    },
    {
        id: '7',
        user: defaultUser,
        message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
        time: '21:32',
    },
    {
        id: '8',
        user: defaultUser,
        message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
        time: '21:32',
    },
    {
        id: '9',
        user: defaultUser,
        message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
        time: '21:32',
    },
    {
        id: '10',
        user: defaultUser,
        message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
        time: '21:32',
    },
];

const cnChat = cn(s, 'Chat');

const Chat: React.FC<ChatProps> = ({ messages = defaultMessages, className }) => {
    useStyles(s);

    return (
        <Panel
            className={cnChat(null, [className])}
            leftHead={
                <Text className={cnChat('PanelTitle')} font="Rubik" size="l" color="white" upper>
                    Чат
                </Text>
            }
        >
            <Scrollable className={cnChat('Messages')} disablePadding>
                <div className={cnChat('MessagesItems')}>
                    {messages.map(message => (
                        <ChatMessage {...message} key={message.id} />
                    ))}
                </div>
            </Scrollable>
            <ChatMessageForm />
        </Panel>
    );
};

export default Chat;
