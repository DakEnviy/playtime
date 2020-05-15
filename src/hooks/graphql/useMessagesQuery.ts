import { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';

import {
    DeletedMessageDocument,
    DeletedMessageSubscription,
    MessagesDocument,
    MessagesQuery,
    SentMessageDocument,
    SentMessageSubscription,
} from '../../__generated__/graphql';
import { appendById } from '../../utils/update';

export interface UseMessagesQueryResult {
    loading: boolean;
    messages?: MessagesQuery['messages'];
}

const useMessagesQuery = (
    onSentMessage?: (message: SentMessageSubscription['sentMessage']) => void,
): UseMessagesQueryResult => {
    const { data, loading, subscribeToMore } = useQuery<MessagesQuery>(MessagesDocument);

    useEffect(() => {
        subscribeToMore<SentMessageSubscription>({
            document: SentMessageDocument,
            updateQuery: (prev, { subscriptionData }) => {
                const { sentMessage } = subscriptionData.data;

                if (onSentMessage) {
                    onSentMessage(sentMessage);
                }

                return {
                    ...prev,
                    messages: appendById(prev.messages, sentMessage),
                };
            },
        });

        subscribeToMore<DeletedMessageSubscription>({
            document: DeletedMessageDocument,
            updateQuery: (prev, { subscriptionData }) => {
                const { deletedMessage } = subscriptionData.data;

                return {
                    ...prev,
                    messages: prev.messages.filter(message => message.id !== deletedMessage.messageId),
                };
            },
        });
    }, [subscribeToMore, onSentMessage]);

    return {
        loading,
        messages: data && data.messages.slice(-100),
    };
};

export default useMessagesQuery;
