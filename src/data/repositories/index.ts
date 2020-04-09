import { Database } from '../models';
import UsersRepository from './users';

const initRepositories = (db: Database) => ({
    users: new UsersRepository(db),
});

export default initRepositories;
