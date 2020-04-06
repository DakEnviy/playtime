import 'reflect-metadata'; // Necessary dependency for @graphql-modules/di
import { Request, Response } from 'express';
import { GraphQLModule } from '@graphql-modules/core';

import ScalarsModule from './scalars';
import UsersModule from './users';

export interface RootSession {
    req: Request;
    res: Response;
    user?: Express.User;
}

const AppModule = new GraphQLModule({
    imports: [ScalarsModule, UsersModule],
});

export default AppModule;
