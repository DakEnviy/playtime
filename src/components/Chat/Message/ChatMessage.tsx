import React, { useMemo } from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './ChatMessage.scss';
import { cn } from '../../../utils/bem-css-module';
import { matchEmojiAlt } from '../../../utils/message';
import Text from '../../Text/Text';
import TextBlock from '../../TextBlock/TextBlock';
import Emoji, { EmojiProps } from '../../Emoji/Emoji';

type StringOrElement = string | React.ReactElement;

export interface ChatMessageProps {
    id: string;
    user: { id: string; username: string; avatar: string };
    message: string;
    time: string;
}

const emojify = (elements: StringOrElement[]): StringOrElement[] => {
    let matchedIndex: number | undefined;
    let matchedEmojiAlt: [string, number, number] | undefined;

    elements.some((elem, index) => {
        if (typeof elem !== 'string') return false;

        const match = matchEmojiAlt(elem);
        if (match) {
            matchedIndex = index;
            matchedEmojiAlt = match;
            return true;
        }

        return false;
    });

    if (typeof matchedIndex === 'undefined' || !matchedEmojiAlt) {
        return elements;
    }

    const matchedString = elements[matchedIndex] as string;
    const [emojiAlt, start, end] = matchedEmojiAlt;

    return emojify([
        ...elements.slice(0, matchedIndex),
        matchedString.slice(0, start),
        <Emoji alt={emojiAlt.slice(1, -1) as EmojiProps['alt']} />,
        matchedString.slice(end),
        ...elements.slice(matchedIndex + 1),
    ]);
};

const transformNewLines = (elements: StringOrElement[]): StringOrElement[] => {
    let matchedIndex: number | undefined;
    let matchedStart: number | undefined;
    let matchedEnd: number | undefined;

    elements.some((elem, index) => {
        if (typeof elem !== 'string') return false;

        const match = /\n/.exec(elem);
        if (match) {
            matchedIndex = index;
            matchedStart = match.index;
            matchedEnd = match.index + match[0].length;
            return true;
        }

        return false;
    });

    if (
        typeof matchedIndex === 'undefined' ||
        typeof matchedStart === 'undefined' ||
        typeof matchedEnd === 'undefined'
    ) {
        return elements;
    }

    const matchedString = elements[matchedIndex] as string;

    return transformNewLines([
        ...elements.slice(0, matchedIndex),
        matchedString.slice(0, matchedStart),
        <br />,
        matchedString.slice(matchedEnd),
        ...elements.slice(matchedIndex + 1),
    ]);
};

const transformMessage = (message: string): React.ReactNode => {
    return React.createElement(React.Fragment, null, ...transformNewLines(emojify([message])).filter(Boolean));
};

const cnChatMessage = cn(s, 'ChatMessage');

const ChatMessage: React.FC<ChatMessageProps> = ({ user, message, time }) => {
    useStyles(s);

    const transformedMessage = useMemo(() => transformMessage(message), [message]);

    return (
        <div className={cnChatMessage()}>
            <img className={cnChatMessage('Avatar')} src={user.avatar} alt={user.username} />
            <div className={cnChatMessage('Main')}>
                <div className={cnChatMessage('Top')}>
                    <Text className={cnChatMessage('Username')} color="white" upper>
                        {user.username}
                    </Text>
                    <Text className={cnChatMessage('Time')} upper>
                        {time}
                    </Text>
                </div>
                <TextBlock weight="semiBold">{transformedMessage}</TextBlock>
            </div>
        </div>
    );
};

export default ChatMessage;
