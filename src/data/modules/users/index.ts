import { GraphQLModule } from '@graphql-modules/core';

import { ApolloContext } from '../../../interfaces/apollo';
import ScalarsModule from '../scalars';
import UsersProvider from './users.provider';
import schema from './schema.graphql';
import resolvers from './resolvers';

export interface UsersContext {
    user?: Express.User;
}

const UsersModule = new GraphQLModule<{}, ApolloContext, UsersContext>({
    name: 'users',
    imports: [ScalarsModule],
    providers: [UsersProvider],
    typeDefs: schema,
    resolvers,
    context: ({ user }) => ({ user }),
});

export default UsersModule;
