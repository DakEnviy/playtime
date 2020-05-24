import { Database } from '../models';
import SettingsRepository from './settings';
import UsersRepository from './users';
import MessagesRepository from './messages';

const initRepositories = (db: Database) => ({
    settings: new SettingsRepository(db),
    users: new UsersRepository(db),
    messages: new MessagesRepository(db),
});

export default initRepositories;
