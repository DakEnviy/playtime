import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './LayoutHeader.scss';
import { cn } from '../../../utils/bem-css-module';
import HeaderNavigationItem from './NavigationItem/HeaderNavigationItem';
import Balance from './Balance/Balance';
import Button from '../../Button/Button';
import MiniProfile from './MiniProfile/MiniProfile';

export interface LayoutHeaderProps {}

const cnLayoutHeader = cn(s, 'LayoutHeader');

const LayoutHeader: React.FC<LayoutHeaderProps> = () => {
    useStyles(s);

    return (
        <header className={cnLayoutHeader()}>
            <div className={cnLayoutHeader('Container')}>
                <nav className={cnLayoutHeader('Navigation')}>
                    <HeaderNavigationItem to="/" text="Все игры" icon="gamepad" iconHover="gamepadWhite" />
                    <HeaderNavigationItem to="/" text="Бонусы" icon="ingots" iconHover="ingotsWhite" />
                    <HeaderNavigationItem to="/" text="FAQ" icon="faq" iconHover="faqWhite" />
                </nav>
                <div className={cnLayoutHeader('Right')}>
                    <Balance />
                    <div className={cnLayoutHeader('Buttons')}>
                        <Button className={cnLayoutHeader('Button')} icon="prize" iconHover="prizeWhite" color="gray" />
                        <Button className={cnLayoutHeader('Button')} icon="bell" iconHover="bellWhite" color="gray" />
                        <Button
                            className={cnLayoutHeader('Button')}
                            icon="message"
                            iconHover="messageWhite"
                            color="gray"
                        />
                    </div>
                    <MiniProfile />
                </div>
            </div>
        </header>
    );
};

export default LayoutHeader;
