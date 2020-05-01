import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './MiniProfile.scss';
import { cn } from '../../../../utils/bem-css-module';
import avatarImg from './avatar.jpg';
import Link from '../../../Link/Link';
import Icon from '../../../Icon/Icon';

export interface MiniProfileProps {}

const cnMiniProfile = cn(s, 'MiniProfile');

const MiniProfile: React.FC<MiniProfileProps> = () => {
    useStyles(s);

    return (
        <div className={cnMiniProfile()}>
            <Link className={cnMiniProfile('Avatar')} to="/">
                <img className={cnMiniProfile('AvatarImg')} src={avatarImg} alt="Аватар" />
            </Link>
            <Link className={cnMiniProfile('LogOut')} to="/logout" external>
                <Icon className={cnMiniProfile('LogOutIcon')} type="signOut" size="xs" />
            </Link>
        </div>
    );
};

export default MiniProfile;
