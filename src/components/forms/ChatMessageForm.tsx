import React from 'react';
import { Form } from 'react-final-form';

import MessageField from '../fields/MessageField';

export interface ChatMessageFormProps {}

const ChatMessageForm: React.FC<ChatMessageFormProps> = () => {
    return (
        <Form onSubmit={() => {}}>{({ handleSubmit }) => <MessageField name="message" onSubmit={handleSubmit} />}</Form>
    );
};

export default ChatMessageForm;
