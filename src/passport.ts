import passport from 'passport';
import { Strategy as VkStrategy, Profile as VkProfile, VerifyCallback as VkVerifyCallback } from 'passport-vkontakte';

import { User } from './data/models/User';
import db from './data/database';
import config from './config';

const authVk = async (profile: VkProfile): Promise<User> => {
    const user: User | null = await db.User.findOne({
        where: { vkId: profile.id },
    });

    const avatar = profile.photos ? profile.photos[1].value : 'default_avatar'; // TODO: default avatar

    if (!user) {
        return db.User.create({
            vkId: profile.id,
            username: profile.displayName,
            avatar,
        });
    }

    return user.update({
        username: profile.displayName,
        avatar,
    });
};

/**
 * Sign in with VK.
 */
passport.use(
    new VkStrategy(
        {
            clientID: config.auth.vk.appId,
            clientSecret: config.auth.vk.appSecret,
            callbackURL: '/auth/vk/return',
            profileFields: ['photo_200'],
        },
        async (_0: string, _1: string, profile: VkProfile, done: VkVerifyCallback) => {
            const user = await authVk(profile);

            done(null, { id: user.id });
        },
    ),
);

export default passport;
