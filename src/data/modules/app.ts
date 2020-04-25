import { GraphQLModule } from '@graphql-modules/core';

import ScalarsModule from './scalars';
import UsersModule from './users';

const AppModule = new GraphQLModule({
    imports: [ScalarsModule, UsersModule],
});

export default AppModule;
