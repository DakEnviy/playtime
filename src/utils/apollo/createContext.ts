import { Request, Response } from 'express';

import { ApolloContext } from '../../interfaces/apollo';
import { repositories } from '../../data/database';

const createContext = async (req: Request, res: Response): Promise<ApolloContext> => {
    const user = (req.user && (await repositories.users.getUserById(req.user.id))) || undefined;

    return { req, res, user };
};

export default createContext;
