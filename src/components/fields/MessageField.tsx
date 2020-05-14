import React from 'react';
import { Field } from 'react-final-form';

import MessageInput, { MessageInputProps } from '../inputs/MessageInput/MessageInput';

export interface MessageFieldProps {
    name: string;
    emojiSize?: MessageInputProps['emojiSize'];
    onSubmit?: () => void;
}

const MessageField: React.FC<MessageFieldProps> = ({ name, emojiSize, onSubmit }) => {
    return (
        <Field<string> name={name}>
            {({ input }) => (
                <MessageInput
                    value={input.value}
                    onChange={input.onChange}
                    onFocus={input.onFocus}
                    onBlur={input.onBlur}
                    onSubmit={onSubmit}
                    emojiSize={emojiSize}
                />
            )}
        </Field>
    );
};

export default MessageField;
