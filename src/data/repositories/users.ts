import { Profile as VkProfile } from 'passport-vkontakte';

import BaseRepository from './base';
import { User } from '../models/User';
import { UserError } from '../../utils/graphql-shield/errors';
import getBanEndTime from '../../utils/chatWarns';

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
            throw new UserError('NO_USER');
        }

        return user;
    }

    async warnChat(userId: string): Promise<User> {
        const now = Date.now();
        const user = await this.getUserByIdStrict(userId);

        let { chatWarns } = user;
        if (chatWarns > 0) {
            const banEndTime = getBanEndTime(user.chatWarnsUpdatedAt, user.chatWarns);

            if (now >= banEndTime) {
                chatWarns = 0;
            }
        }

        return user.update({
            chatWarns: chatWarns + 1,
            chatWarnsUpdatedAt: new Date(now),
        });
    }

    async isChatBanned(userId: string): Promise<boolean> {
        const now = Date.now();
        const user = await this.getUserByIdStrict(userId);

        if (user.chatWarns > 0) {
            const banEndTime = getBanEndTime(user.chatWarnsUpdatedAt, user.chatWarns);

            if (now >= banEndTime) {
                await user.update({
                    chatWarns: 0,
                    chatWarnsUpdatedAt: new Date(now),
                });
                return false;
            }

            return true;
        }

        return false;
    }
}

export default UsersRepository;
