import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './Footer.scss';
import { cn } from '../../../utils/bem-css-module';
import Text from '../../../components/Text/Text';
import Button from '../../../components/Button/Button';
import Link from '../../../components/Link/Link';

const cnFooter = cn(s, 'Footer');

const Footer: React.FC = () => {
    useStyles(s);

    return (
        <footer className={cnFooter()}>
            <div className={cnFooter('Container')}>
                <div className={cnFooter('Main')}>
                    <ul className={cnFooter('Navigation')}>
                        <li>
                            <Link to="/">
                                <Text size="xs">О проекте</Text>
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                <Text size="xs">Вопросы и ответы</Text>
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                <Text size="xs">Правила</Text>
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                <Text size="xs">Партнерская программа</Text>
                            </Link>
                        </li>
                        <li>
                            <Link to="/">
                                <Text size="xs">Контакты</Text>
                            </Link>
                        </li>
                    </ul>
                    <div>
                        <Button className={cnFooter('SocialButton')} color="gray">
                            VK
                        </Button>
                        <Button className={cnFooter('SocialButton')} color="gray">
                            TG
                        </Button>
                        <Button className={cnFooter('SocialButton')} color="gray">
                            IN
                        </Button>
                    </div>
                </div>
                <div className={cnFooter('Copyright')}>
                    <Text size="xs">Ruletka © 2020</Text>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
