import { GraphQLModule } from '@graphql-modules/core';

import { RootSession } from '../app';
import ScalarsModule from '../scalars';
import UsersProvider from './users.provider';
import schema from './schema.graphql';
import resolvers from './resolvers';

export interface UsersContext {
    user?: Express.User;
}

const UsersModule = new GraphQLModule<{}, RootSession, UsersContext>({
    name: 'users',
    imports: [ScalarsModule],
    providers: [UsersProvider],
    typeDefs: schema,
    resolvers,
    context: session => ({
        user: session.user,
    }),
});

export default UsersModule;
