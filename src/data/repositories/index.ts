import { Database } from '../models';
import SettingsRepository from './settings';
import UsersRepository from './users';
import MessagesRepository from './messages';
import ClassicGamesRepository from './classicGames';
import ClassicGameBetsRepository from './classicGameBets';

const initRepositories = (db: Database) => ({
    settings: new SettingsRepository(db),
    users: new UsersRepository(db),
    messages: new MessagesRepository(db),
    classicGames: new ClassicGamesRepository(db),
    classicGameBets: new ClassicGameBetsRepository(db),
});

export default initRepositories;
