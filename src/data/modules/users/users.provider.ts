import { Injectable } from '@graphql-modules/di';

import db from '../../database';
import { User } from '../../models/User';

@Injectable()
class UsersProvider {
    // eslint-disable-next-line class-methods-use-this
    async getUserById(userId: string): Promise<User> {
        return db.User.findByPk(userId);
    }
}

export default UsersProvider;
