import { ModuleContext } from '@graphql-modules/core';
import { chain, IRules } from 'graphql-shield';

import { ChatContext } from './index';
import { Resolver, ResolverOptions, Resolvers, TypeResolvers } from '../../../interfaces/graphql';
import { SerializedModel } from '../../../interfaces/sequelize';
import {
    DeletedMessagePayload,
    DeletedMessagesBySenderPayload,
    Message,
    Mutation,
    MutationDeleteMessageArgs,
    MutationMuteChatArgs,
    MutationSendMessageArgs,
    Query,
    Subscription,
} from '../../../__generated__/graphql';
import { Message as MessageBackend } from '../../models/Message';
import { OriginUserParent } from '../users/resolvers';
import { repositories } from '../../database';
import pubsub from '../../pubsub';
import { isAdminOrModerator, isAuth, isUserOwner } from '../rules';
import { checkSendMessageArgs } from './rules';
import { UserError } from '../../../utils/graphql-shield/errors';
import limit from '../../../utils/graphql-shield/limit';

export type OriginMessageParent = MessageBackend;

type QueryType = Pick<Query, 'messages'>;
type MutationType = Pick<Mutation, 'sendMessage' | 'deleteMessage' | 'muteChat'>;
type SubscriptionType = Pick<Subscription, 'sentMessage' | 'deletedMessage' | 'deletedMessagesBySender'>;
type MessageType = Pick<Message, 'id' | 'sender' | 'message' | 'createdAt'>;

interface QueryMapping {
    messages: Resolver<OriginMessageParent[]>;
}

interface MutationMapping {
    sendMessage: Resolver<OriginMessageParent, MutationSendMessageArgs>;
    deleteMessage: Resolver<DeletedMessagePayload, MutationDeleteMessageArgs>;
    muteChat: Resolver<DeletedMessagesBySenderPayload, MutationMuteChatArgs>;
}

interface SubscriptionMapping {
    sentMessage: ResolverOptions<OriginMessageParent, SerializedModel<OriginMessageParent>>;
    deletedMessage: ResolverOptions<DeletedMessagePayload>;
    deletedMessagesBySender: ResolverOptions<DeletedMessagesBySenderPayload>;
}

interface MessageMapping {
    id: void;
    sender: Resolver<OriginUserParent>;
    message: void;
    createdAt: void;
}

type ChatResolvers = Resolvers<
    {
        Query: TypeResolvers<QueryType, QueryMapping>;
        Mutation: TypeResolvers<MutationType, MutationMapping>;
        Subscription: TypeResolvers<SubscriptionType, SubscriptionMapping>;
        Message: TypeResolvers<MessageType, MessageMapping, OriginMessageParent>;
    },
    ModuleContext<ChatContext>
>;

export const rules: IRules = {
    Mutation: {
        sendMessage: chain(isAuth, checkSendMessageArgs, limit(15)),
        deleteMessage: isAdminOrModerator,
        muteChat: isAdminOrModerator,
    },
    User: {
        isChatMute: isUserOwner,
    },
};

export const resolvers: ChatResolvers = {
    Query: {
        messages: () => {
            return repositories.messages.getMessages();
        },
    },
    Mutation: {
        sendMessage: async (_0, { input: { message } }, { user }) => {
            if (user!.isChatMute) {
                throw new UserError('CHAT_MUTE_ERROR');
            }

            const sentMessage = await repositories.messages.addMessage(user!.id, message);

            pubsub.publish('sentMessage', sentMessage).then();
            return sentMessage;
        },
        deleteMessage: async (_0, { input: { messageId } }) => {
            await repositories.messages.deleteMessage(messageId);

            pubsub.publish('deletedMessage', { messageId }).then();
            return { messageId };
        },
        muteChat: async (_0, { input: { userId, isChatMute } }) => {
            await repositories.users.muteChat(userId, isChatMute);

            if (isChatMute) {
                await repositories.messages.deleteMessagesBySender(userId);

                pubsub.publish('deletedMessagesBySender', { senderId: userId }).then();
            } else {
                await repositories.messages.restoreMessagesBySender(userId);
            }

            return { senderId: userId };
        },
    },
    Subscription: {
        sentMessage: {
            resolve: ({ sentMessage }) => {
                return repositories.messages.getMessageByIdStrict(sentMessage.id);
            },
            subscribe: () => pubsub.asyncIterator('sentMessage'),
        },
        deletedMessage: {
            subscribe: () => pubsub.asyncIterator('deletedMessage'),
        },
        deletedMessagesBySender: {
            subscribe: () => pubsub.asyncIterator('deletedMessagesBySender'),
        },
    },
    Message: {
        sender: message => {
            return message.getSender();
        },
    },
};
