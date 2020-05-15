import React, { useCallback, useMemo } from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './ChatMessage.scss';
import { cn } from '../../../utils/bem-css-module';
import { MessageFragment } from '../../../__generated__/graphql';
import { matchEmojiAlt } from '../../../utils/message';
import Text from '../../Text/Text';
import TextBlock from '../../TextBlock/TextBlock';
import Emoji, { EmojiProps } from '../../Emoji/Emoji';
import Button from '../../Button/Button';

type StringOrElement = string | React.ReactElement;

export interface ChatMessageProps extends MessageFragment {
    showControls?: boolean;
    onDeleteMessage: (messageId: string) => void;
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

const addLeadingZeros = (number: number) => {
    return `0${number}`.slice(-2);
};

const transformDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${addLeadingZeros(date.getHours())}:${addLeadingZeros(date.getMinutes())}`;
};

const cnChatMessage = cn(s, 'ChatMessage');

const ChatMessage: React.FC<ChatMessageProps> = ({ id, sender, message, createdAt, showControls, onDeleteMessage }) => {
    useStyles(s);

    const transformedMessage = useMemo(() => transformMessage(message), [message]);
    const onClick = useCallback(() => onDeleteMessage(id), [id, onDeleteMessage]);

    return (
        <div className={cnChatMessage({ showControls })}>
            <img className={cnChatMessage('Avatar')} src={sender.avatar} alt={sender.username} />
            <div className={cnChatMessage('Main')}>
                <div className={cnChatMessage('Top')}>
                    <Text className={cnChatMessage('Username')} color="white">
                        {sender.username}
                    </Text>
                    <Text className={cnChatMessage('Time')}>{transformDate(createdAt)}</Text>
                </div>
                <TextBlock weight="semiBold">{transformedMessage}</TextBlock>
            </div>
            {showControls && (
                <div className={cnChatMessage('Controls')}>
                    <Button className={cnChatMessage('ControlsButton')} icon="delete" clear onClick={onClick} />
                    <Button className={cnChatMessage('ControlsButton')} icon="ban" clear />
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
