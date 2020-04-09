import { Injectable } from '@graphql-modules/di';

import { database } from '../../database';
import { User } from '../../models/User';

@Injectable()
class UsersProvider {
    // eslint-disable-next-line class-methods-use-this
    async getUserById(userId: string): Promise<User> {
        return database.User.findByPk(userId);
    }
}

export default UsersProvider;
