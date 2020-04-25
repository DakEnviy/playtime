import { ModuleContext } from '@graphql-modules/core';
import { IRules } from 'graphql-shield';

import { UsersContext } from './index';
import { Resolver, Resolvers, TypeResolvers } from '../../../interfaces/graphql';
import { Query, QueryUserArgs, User } from '../../../__generated__/graphql';
import { repositories } from '../../database';
import { isAuth } from '../rules';
import { checkUserArgs } from './rules';

type QueryType = Pick<Query, 'me' | 'user'>;
type UserType = Pick<User, 'id' | 'role' | 'username' | 'avatar'>;

interface QueryMapping {
    me: Resolver<UserType | null>;
    user: Resolver<UserType | null, QueryUserArgs>;
}

type UsersResolvers = Resolvers<
    {
        Query: TypeResolvers<QueryType, QueryMapping>;
    },
    ModuleContext<UsersContext>
>;

export const rules: IRules = {
    Query: {
        me: isAuth,
        user: checkUserArgs,
    },
};

export const resolvers: UsersResolvers = {
    Query: {
        me: (_0, _1, ctx) => {
            return ctx.user || null;
        },
        user: (_0, { userId }) => {
            return repositories.users.getUserById(userId);
        },
    },
};
