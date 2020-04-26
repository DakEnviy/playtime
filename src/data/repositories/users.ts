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

    async getUserById(userId: string): Promise<User | null> {
        return this.db.User.findByPk(userId);
    }

    async getUserByIdStrict(userId: string): Promise<User> {
        const user = await this.getUserById(userId);

        if (!user) {
            throw new Error('NO_USER');
        }

        return user;
    }

    async muteChat(userId: string, isChatMute: boolean): Promise<User> {
        const user = await this.getUserByIdStrict(userId);

        return user.update({ isChatMute });
    }
}

export default UsersRepository;
