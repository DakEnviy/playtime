import passport from 'passport';
import { Strategy as VkStrategy, Profile as VkProfile, VerifyCallback as VkVerifyCallback } from 'passport-vkontakte';

import config from './config';
import { repositories } from './data/database';

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
            const user = await repositories.users.authVk(profile);

            done(null, { id: user.id });
        },
    ),
);

export default passport;
