import React, { useCallback, useEffect, useRef } from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './Chat.scss';
import { cn } from '../../utils/bem-css-module';
import ChatMessage from './Message/ChatMessage';
import Panel from '../Panel/Panel';
import Text from '../Text/Text';
import Scrollable, { ScrollableRef } from '../Scrollable/Scrollable';
import ChatMessageForm from '../forms/ChatMessageForm';
import useMessagesQuery from '../../graphql/hooks/useMessagesQuery';

export interface ChatProps {
    className?: string;
}

// const defaultUser: ChatMessageProps['user'] = {
//     id: '1',
//     username: 'Mr. Cat',
//     avatar:
//         'https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg',
// };

// const defaultMessages: ChatMessageProps[] = [
//     {
//         id: '1',
//         user: {
//             ...defaultUser,
//             username:
//                 'Mr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.CatMr.Cat',
//         },
//         message: 'При\nвет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
//         time: '21:32',
//     },
//     {
//         id: '2',
//         user: defaultUser,
//         message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
//         time: '21:32',
//     },
//     {
//         id: '3',
//         user: defaultUser,
//         message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
//         time: '21:32',
//     },
//     {
//         id: '4',
//         user: defaultUser,
//         message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
//         time: '21:32',
//     },
//     {
//         id: '5',
//         user: defaultUser,
//         message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
//         time: '21:32',
//     },
//     {
//         id: '6',
//         user: defaultUser,
//         message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
//         time: '21:32',
//     },
//     {
//         id: '7',
//         user: defaultUser,
//         message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
//         time: '21:32',
//     },
//     {
//         id: '8',
//         user: defaultUser,
//         message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
//         time: '21:32',
//     },
//     {
//         id: '9',
//         user: defaultUser,
//         message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
//         time: '21:32',
//     },
//     {
//         id: '10',
//         user: defaultUser,
//         message: 'Привет, kek :devil:<span>Сдохни</span>\nkek :fff:angel::smile:',
//         time: '21:32',
//     },
// ];

const cnChat = cn(s, 'Chat');

const Chat: React.FC<ChatProps> = ({ className }) => {
    useStyles(s);

    const scrollableRef = useRef<ScrollableRef | null>(null);

    const scrollTo = (y: number, duration: number) => {
        if (scrollableRef.current) {
            scrollableRef.current.scrollTo(y, duration);
        }
    };

    const onMessageSend = useCallback(() => {
        scrollTo(-0, 100);
    }, []);

    const onMessageSendOther = useCallback(() => {
        if (
            scrollableRef.current &&
            scrollableRef.current.getScrollHeight() -
                scrollableRef.current.getScrollTop() -
                scrollableRef.current.getClientHeight() <=
                30
        ) {
            setTimeout(() => scrollTo(-0, 100), 100);
        }
    }, []);

    const { loading, messages } = useMessagesQuery(onMessageSendOther);

    useEffect(() => {
        scrollTo(-0, 700);
    }, []);

    return (
        <Panel
            className={cnChat(null, [className])}
            leftHead={
                <Text className={cnChat('PanelTitle')} font="Rubik" size="l" color="white" upper>
                    Чат
                </Text>
            }
        >
            <Scrollable className={cnChat('Messages')} disablePadding ref={scrollableRef}>
                <div className={cnChat('MessagesItems')}>
                    {loading || !messages
                        ? 'Loading...'
                        : messages.map(message => <ChatMessage {...message} key={message.id} />)}
                </div>
            </Scrollable>
            <ChatMessageForm onMutate={onMessageSend} />
        </Panel>
    );
};

export default Chat;
