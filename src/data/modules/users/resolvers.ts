import { Resolver, Resolvers, TypeResolvers } from '../../../interfaces/graphql';
import { Query, QueryUserArgs, User } from '../../../__generated__/graphql';
import { UsersContext } from './index';
import UsersProvider from './users.provider';
import { User as UserModel } from '../../models/User';

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
    UsersContext
>;

const userAdapter = (user: UserModel): UserType => ({
    id: user.id,
    username: user.username,
    avatar: user.avatar,
    role: user.role,
});

const resolvers: UsersResolvers = {
    Query: {
        me: async (_0, _1, ctx) => {
            if (!ctx.user) return null;

            const user = await ctx.injector.get(UsersProvider).getUserById(ctx.user.id);

            return userAdapter(user);
        },
        user: async (_0, { userId }, ctx) => {
            const user = await ctx.injector.get(UsersProvider).getUserById(userId);

            return userAdapter(user);
        },
    },
};

export default resolvers;
