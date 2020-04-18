import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './WelcomeHeader.scss';
import { cn } from '../../../utils/bem-css-module';
import NavigationItem from './NavigationItem/NavigationItem';
import logoImg from './logo.svg';
import Button from '../../../components/Button/Button';
import Link from '../../../components/Link/Link';

const cnWelcomeHeader = cn(s, 'WelcomeHeader');

const WelcomeHeader = () => {
    useStyles(s);

    return (
        <header className={cnWelcomeHeader()}>
            <div className={cnWelcomeHeader('Container')}>
                <nav className={cnWelcomeHeader('Navigation')}>
                    <NavigationItem to="/" text="Игры" icon="gamepad" />
                    <NavigationItem to="/" text="Бонусы" icon="ingots" />
                    <NavigationItem to="/" text="Прямой эфир" icon="play" />
                </nav>
                <div className={cnWelcomeHeader('LogoContainer')}>
                    <Link to="/">
                        <img className={cnWelcomeHeader('Logo')} src={logoImg} alt="Рулетка" />
                    </Link>
                </div>
                <div className={cnWelcomeHeader('Buttons')}>
                    <Button color="bordered" weight="normal">
                        Войти
                    </Button>
                    <Button weight="normal">Регистрация</Button>
                </div>
            </div>
        </header>
    );
};

export default WelcomeHeader;
