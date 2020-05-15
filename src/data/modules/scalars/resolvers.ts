import { GraphQLURL } from 'graphql-custom-types';
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
    DateTime: new GraphQLScalarType({
        name: 'DateTime',
        description: 'A date and time, represented as an ISO-8601 string',
        serialize: value => value.toISOString(),
        parseValue: value => new Date(value),
    }),
};

export default resolvers;
