import React, { useCallback } from 'react';
import { Form } from 'react-final-form';
import { FormApi } from 'final-form';

import MessageField from '../fields/MessageField';
import useSendMessageMutation from '../../hooks/graphql/useSendMessageMutation';

export interface ChatMessageFormValues {
    message: string;
}

export interface ChatMessageFormProps {
    onMutate?: () => void;
}

const ChatMessageForm: React.FC<ChatMessageFormProps> = ({ onMutate }) => {
    const sendMessageMutation = useSendMessageMutation();

    const onSubmit = useCallback(
        async (values: ChatMessageFormValues, form: FormApi<ChatMessageFormValues>) => {
            if (!values.message) return;

            await sendMessageMutation(values);

            if (onMutate) {
                onMutate();
            }

            setTimeout(() => form.reset(), 0);
        },
        [sendMessageMutation, onMutate],
    );

    return (
        <Form<ChatMessageFormValues> onSubmit={onSubmit}>
            {({ handleSubmit }) => <MessageField name="message" onSubmit={handleSubmit} />}
        </Form>
    );
};

export default ChatMessageForm;
