import { useMutation } from '@apollo/react-hooks';

import {
    MessagesDocument,
    MessagesQuery,
    SendMessageDocument,
    SendMessageInput,
    SendMessageMutation,
    SendMessageMutationVariables,
} from '../../__generated__/graphql';

const useSendMessageMutation = () => {
    const [sendMessage] = useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, {
        update: (proxy, { data: mutationData }) => {
            if (!mutationData) return;

            const { sendMessage: sentMessage } = mutationData;
            const data = proxy.readQuery<MessagesQuery>({ query: MessagesDocument });

            if (data) {
                if (data.messages.some(message => message.id === sentMessage.id)) {
                    return;
                }

                proxy.writeQuery({
                    query: MessagesDocument,
                    data: { ...data, messages: [...data.messages, sentMessage] },
                });
            }
        },
    });

    return (input: SendMessageInput) => sendMessage({ variables: { input } });
};

export default useSendMessageMutation;
