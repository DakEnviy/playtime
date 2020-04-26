import { rule } from 'graphql-shield';

import { UserError } from '../../utils/graphql-shield/errors';
import { User, UserRole } from '../models/User';
import { OriginUserParent } from './users/resolvers';

export const isAuth = rule({ cache: 'contextual' })((_0, _1, ctx: { user?: User }) => {
    if (!ctx.user) {
        return new UserError('NOT_AUTH');
    }

    return true;
});

export const isAdmin = rule({ cache: 'contextual' })((_0, _1, ctx: { user?: User }) => {
    if (!ctx.user || ctx.user.role !== UserRole.Admin) {
        return new UserError('NOT_ADMIN');
    }

    return true;
});

export const isUserOwner = rule({ cache: 'strict' })((parent: OriginUserParent, _0, ctx: { user?: User }) => {
    if (!ctx.user || parent.id !== ctx.user.id) {
        return new UserError('NOT_USER_OWNER');
    }

    return true;
});
