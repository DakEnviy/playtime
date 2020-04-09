import { Database } from '../models';

class BaseRepository {
    db: Database;

    constructor(db: Database) {
        this.db = db;
    }
}

export default BaseRepository;
