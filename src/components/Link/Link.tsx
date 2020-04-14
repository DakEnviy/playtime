import React, { MouseEvent as ReactMouseEvent } from 'react';

import history from '../../history';
import { isLeftClickEvent, isModifiedEvent } from '../../utils/link';

interface LinkProps {
    to: string;
    external?: boolean;
    newTab?: boolean;
    onClick?: Function;

    className?: string;
}

const Link: React.FC<LinkProps> = ({ to, external, newTab, onClick, children, ...restProps }) => {
    const onLinkClick = (event: ReactMouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (onClick) {
            onClick(event);
        }

        if (isModifiedEvent(event) || !isLeftClickEvent(event)) {
            return;
        }

        if (event.defaultPrevented) {
            return;
        }

        event.preventDefault();
        history.push(to);
    };

    return (
        <a href={to} target={newTab ? '_blank' : undefined} onClick={external ? undefined : onLinkClick} {...restProps}>
            {children}
        </a>
    );
};

export default Link;
