import { Profile as VkProfile } from 'passport-vkontakte';

import BaseRepository from './base';
import { User } from '../models/User';

class UsersRepository extends BaseRepository {
    async authVk(profile: VkProfile): Promise<User> {
        const user: User | null = await this.db.User.findOne({
            where: { vkId: profile.id },
        });

        const avatar = profile.photos ? profile.photos[1].value : 'default_avatar'; // TODO: default avatar

        if (!user) {
            return this.db.User.create({
                vkId: profile.id,
                username: profile.displayName,
                avatar,
            });
        }

        return user.update({
            username: profile.displayName,
            avatar,
        });
    }
}

export default UsersRepository;
