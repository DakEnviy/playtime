import { ExecutionResult } from 'apollo-link';
import { useMutation } from '@apollo/react-hooks';

import {
    MessagesDocument,
    MessagesQuery,
    WarnChatDocument,
    WarnChatInput,
    WarnChatMutation,
    WarnChatMutationVariables,
} from '../../__generated__/graphql';

export interface UseWarnChatMutationResult {
    (input: WarnChatInput): Promise<ExecutionResult<WarnChatMutation>>;
}

const useWarnChatMutation = (): UseWarnChatMutationResult => {
    const [warnChat] = useMutation<WarnChatMutation, WarnChatMutationVariables>(WarnChatDocument, {
        update: (proxy, { data: mutationData }) => {
            if (!mutationData) return;

            const {
                warnChat: { senderId },
            } = mutationData;
            const data = proxy.readQuery<MessagesQuery>({ query: MessagesDocument });

            if (data) {
                proxy.writeQuery({
                    query: MessagesDocument,
                    data: { ...data, messages: data.messages.filter(message => message.sender.id !== senderId) },
                });
            }
        },
    });

    return input => warnChat({ variables: { input } });
};

export default useWarnChatMutation;
