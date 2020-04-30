import { ModuleContext } from '@graphql-modules/core';
import { IRules } from 'graphql-shield';

import { UsersContext } from './index';
import { Resolver, Resolvers, TypeResolvers } from '../../../interfaces/graphql';
import { Query, QueryUserArgs } from '../../../__generated__/graphql';
import { User as UserBackend } from '../../models/User';
import { repositories } from '../../database';
import { isAuth } from '../rules';
import { checkUserArgs } from './rules';

export type OriginUserParent = UserBackend;

type QueryType = Pick<Query, 'me' | 'user'>;

interface QueryMapping {
    me: Resolver<OriginUserParent | null>;
    user: Resolver<OriginUserParent | null, QueryUserArgs>;
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
        me: (_0, _1, { user }) => {
            return user || null;
        },
        user: (_0, { userId }) => {
            return repositories.users.getUserById(userId);
        },
    },
};
