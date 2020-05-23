import { ExecutionResult } from 'apollo-link';
import { useMutation } from '@apollo/react-hooks';

import {
    DeleteMessageDocument,
    DeleteMessageInput,
    DeleteMessageMutation,
    DeleteMessageMutationVariables,
    MessagesDocument,
    MessagesQuery,
} from '../../__generated__/graphql';

export interface UseDeleteMessageMutationResult {
    (input: DeleteMessageInput): Promise<ExecutionResult<DeleteMessageMutation>>;
}

const useDeleteMessageMutation = (): UseDeleteMessageMutationResult => {
    const [deleteMessage] = useMutation<DeleteMessageMutation, DeleteMessageMutationVariables>(DeleteMessageDocument, {
        update: (proxy, { data: mutationData }) => {
            if (!mutationData) return;

            const {
                deleteMessage: { messageId },
            } = mutationData;
            const data = proxy.readQuery<MessagesQuery>({ query: MessagesDocument });

            if (data) {
                proxy.writeQuery({
                    query: MessagesDocument,
                    data: { ...data, messages: data.messages.filter(message => message.id !== messageId) },
                });
            }
        },
    });

    return input => deleteMessage({ variables: { input } });
};

export default useDeleteMessageMutation;
