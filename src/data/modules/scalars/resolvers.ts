import { GraphQLURL, GraphQLDateTime } from 'graphql-custom-types';
import { GraphQLScalarType } from 'graphql';

import { Resolvers } from '../../../interfaces/graphql';

type ScalarResolvers = Resolvers<
    {
        URL: GraphQLScalarType;
        DateTime: GraphQLScalarType;
    },
    never
>;

const resolvers: ScalarResolvers = {
    URL: GraphQLURL,
    DateTime: GraphQLDateTime,
};

export default resolvers;
