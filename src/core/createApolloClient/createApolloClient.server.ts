import { ApolloClient } from 'apollo-client';
import { from } from 'apollo-link';
import { onError } from 'apollo-link-error';
import { SchemaLink } from 'apollo-link-schema';

import createCache from './createCache';

// TODO: write typings for partialCacheDefaults
const createApolloClient = (schema: SchemaLink.Options, partialCacheDefaults: object = {}) => {
    const cache = createCache();

    cache.writeData({
        data: partialCacheDefaults,
    });

    const link = from([
        onError(({ graphQLErrors, networkError }) => {
            if (graphQLErrors)
                graphQLErrors.map(({ message, locations, path }) =>
                    console.warn(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
                );
            if (networkError) console.warn(`[Network error]: ${networkError}`);
        }),
        new SchemaLink({ ...schema }),
    ]);

    return new ApolloClient({
        link,
        cache,
        ssrMode: true,
        queryDeduplication: true,
    });
};

export default createApolloClient;
