import { GraphQLScalarType } from 'graphql';
import { GraphQLDateTime, GraphQLHexColorCode, GraphQLURL } from 'graphql-scalars';

import { Resolvers } from '../../../interfaces/graphql';

type ScalarResolvers = Resolvers<
    {
        URL: GraphQLScalarType;
        DateTime: GraphQLScalarType;
        HexColorCode: GraphQLScalarType;
    },
    never
>;

const resolvers: ScalarResolvers = {
    URL: GraphQLURL,
    DateTime: GraphQLDateTime,
    HexColorCode: GraphQLHexColorCode,
};

export default resolvers;
