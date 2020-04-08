import React, { ReactNode } from 'react';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import StyleContext from 'isomorphic-style-loader/StyleContext';

import AppContext, { AppContextTypes } from '../context';

interface AppProps {
    insertCss: Function;
    client: ApolloClient<NormalizedCacheObject>;
    context: AppContextTypes;
    children: ReactNode;
}

const App = ({ client, insertCss, context, children }: AppProps) => (
    // NOTE: If you need to add or modify header, footer etc. of the app,
    // please do that inside the Layout component.
    <ApolloProvider client={client}>
        <AppContext.Provider value={context}>
            <StyleContext.Provider value={{ insertCss }}>{children}</StyleContext.Provider>
        </AppContext.Provider>
    </ApolloProvider>
);

export default App;
