import React from 'react';

import history from '../../history';
import { isLeftClickEvent, isModifiedEvent } from '../../utils/link';

interface LinkProps {
    to: string;
    onClick?: Function;
    className?: string;
}

const Link: React.FC<LinkProps> = ({ to, onClick, children, ...restProps }) => (
    <a
        href={to}
        {...restProps}
        onClick={event => {
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
        }}
    >
        {children}
    </a>
);

export default Link;
