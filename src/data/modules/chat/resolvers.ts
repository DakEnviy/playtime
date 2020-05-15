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
    MutationSendMessageArgs,
    MutationWarnChatArgs,
    Query,
    Subscription,
} from '../../../__generated__/graphql';
import { Message as MessageBackend } from '../../models/Message';
import { OriginUserParent } from '../users/resolvers';
import { repositories } from '../../database';
import pubsub from '../../pubsub';
import { isAdminOrModerator, isAuth } from '../rules';
import { checkSendMessageArgs } from './rules';
import { UserError } from '../../../utils/graphql-shield/errors';
import limit from '../../../utils/graphql-shield/limit';

export type OriginMessageParent = MessageBackend;

type QueryType = Pick<Query, 'messages'>;
type MutationType = Pick<Mutation, 'sendMessage' | 'deleteMessage' | 'warnChat'>;
type SubscriptionType = Pick<Subscription, 'sentMessage' | 'deletedMessage' | 'deletedMessagesBySender'>;
type MessageType = Pick<Message, 'id' | 'sender' | 'message' | 'createdAt'>;

interface QueryMapping {
    messages: Resolver<OriginMessageParent[]>;
}

interface MutationMapping {
    sendMessage: Resolver<OriginMessageParent, MutationSendMessageArgs>;
    deleteMessage: Resolver<DeletedMessagePayload, MutationDeleteMessageArgs>;
    warnChat: Resolver<DeletedMessagesBySenderPayload, MutationWarnChatArgs>;
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
        warnChat: isAdminOrModerator,
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
            // Проверка на chatWarns добавлена для оптимизации, чтобы не делать лишний запрос к БД
            const isChatBanned = user!.chatWarns > 0 && (await repositories.users.isChatBanned(user!.id));
            if (isChatBanned) {
                throw new UserError('CHAT_BANNED');
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
        warnChat: async (_0, { input: { userId } }) => {
            await repositories.users.warnChat(userId);
            await repositories.messages.deleteMessagesBySender(userId);

            pubsub.publish('deletedMessagesBySender', { senderId: userId }).then();

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
