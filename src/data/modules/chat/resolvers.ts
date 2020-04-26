import { ModuleContext } from '@graphql-modules/core';
import { IRules } from 'graphql-shield';

import { ChatContext } from './index';
import { Resolver, Resolvers, TypeResolvers } from '../../../interfaces/graphql';
import {
    DeletedMessagePayload,
    DeletedMessagesBySenderPayload,
    Message,
    Mutation,
    MutationDeleteMessageArgs,
    MutationMuteChatArgs,
    MutationSendMessageArgs,
    Query,
} from '../../../__generated__/graphql';
import { Message as MessageBackend } from '../../models/Message';
import { OriginUserParent } from '../users/resolvers';
import { repositories } from '../../database';
import { isAuth, isUserOwner } from '../rules';

export type OriginMessageParent = MessageBackend;

type QueryType = Pick<Query, 'messages'>;
type MutationType = Pick<Mutation, 'sendMessage' | 'deleteMessage' | 'muteChat'>;
type MessageType = Pick<Message, 'id' | 'sender' | 'message' | 'createdAt'>;

interface QueryMapping {
    messages: Resolver<OriginMessageParent[]>;
}

interface MutationMapping {
    sendMessage: Resolver<OriginMessageParent, MutationSendMessageArgs>;
    deleteMessage: Resolver<DeletedMessagePayload, MutationDeleteMessageArgs>;
    muteChat: Resolver<DeletedMessagesBySenderPayload, MutationMuteChatArgs>;
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
        Message: TypeResolvers<MessageType, MessageMapping, OriginMessageParent>;
    },
    ModuleContext<ChatContext>
>;

export const rules: IRules = {
    Mutation: {
        sendMessage: isAuth,
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
            return repositories.messages.addMessage(user!.id, message);
        },
        deleteMessage: async (_0, { input: { messageId } }) => {
            await repositories.messages.deleteMessage(messageId);
            return { messageId };
        },
        muteChat: async (_0, { input: { userId, isChatMute } }) => {
            await repositories.users.muteChat(userId, isChatMute);

            if (isChatMute) {
                await repositories.messages.deleteMessagesBySender(userId);
            } else {
                await repositories.messages.restoreMessagesBySender(userId);
            }

            return { senderId: userId };
        },
    },
    Message: {
        sender: message => {
            return message.getSender();
        },
    },
};
