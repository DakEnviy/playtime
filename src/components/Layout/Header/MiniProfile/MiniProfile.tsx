import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './MiniProfile.scss';
import { cn } from '../../../../utils/bem-css-module';
import Link from '../../../Link/Link';
import Icon from '../../../Icon/Icon';

export interface MiniProfileProps {}

const cnMiniProfile = cn(s, 'MiniProfile');

const MiniProfile: React.FC<MiniProfileProps> = () => {
    useStyles(s);

    return (
        <div className={cnMiniProfile()}>
            <Link className={cnMiniProfile('Avatar')} to="/">
                <img
                    className={cnMiniProfile('AvatarImg')}
                    src="https://ae01.alicdn.com/kf/HTB1FA7NaifrK1RjSspbq6A4pFXau/Cool-Stylish-and-Funny-Cute-Pet-Sunglasses-Classic-Retro-Circular-Metal-Prince-Sunglasses-for-Cat-Chihuahua.jpg"
                    alt="Аватар"
                />
            </Link>
            <Link className={cnMiniProfile('LogOut')} to="/logout" external>
                <Icon className={cnMiniProfile('LogOutIcon')} type="signOut" size="xs" />
            </Link>
        </div>
    );
};

export default MiniProfile;
