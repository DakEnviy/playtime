import { GraphQLModule } from '@graphql-modules/core';

import ScalarsModule from './scalars';
import UsersModule from './users';
import ChatModule from './chat';
import ClassicGameModule from './classicGame';

const AppModule = new GraphQLModule({
    imports: [ScalarsModule, UsersModule, ChatModule, ClassicGameModule],
});

export default AppModule;
