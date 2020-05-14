import React from 'react';
import useStyles from 'isomorphic-style-loader/useStyles';

import s from './Layout31WithChat.scss';
import { cn } from '../../../utils/bem-css-module';
import Layout from '../Layout';
import Chat from '../../Chat/Chat';

export interface Layout31WithChatProps {
    leftContent: React.ReactNode;
    rightContent: React.ReactNode;
    bottomContent: React.ReactNode;
}

const cnLayout31WithChat = cn(s, 'Layout31WithChat');

const Layout31WithChat: React.FC<Layout31WithChatProps> = ({ leftContent, rightContent, bottomContent }) => {
    useStyles(s);

    return (
        <Layout>
            <div className={cnLayout31WithChat('Top')}>
                <div className={cnLayout31WithChat('LeftContent')}>{leftContent}</div>
                <div className={cnLayout31WithChat('RightContent')}>{rightContent}</div>
                <Chat className={cnLayout31WithChat('Chat')} />
            </div>
            <div>{bottomContent}</div>
        </Layout>
    );
};

export default Layout31WithChat;
