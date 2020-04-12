import { ModuleContext } from '@graphql-modules/core';

import { UsersContext } from './index';
import UsersProvider from './users.provider';
import { Maybe, User } from '../../../__generated__/graphql';

const resolvers = {
    Query: {
        async me(_0: unknown, _1: {}, ctx: ModuleContext<UsersContext>): Promise<Maybe<User>> {
            if (!ctx.user) return null;

            const user = await ctx.injector.get(UsersProvider).getUserById(ctx.user.id);

            return {
                id: user.id,
                username: user.username,
                avatar: user.avatar,
            };
        },
    },
};

export default resolvers;
