import { useContext } from 'react';

import AppContext from '../context';

const useIsOnPath = (pathname: string) => {
    const appContext = useContext(AppContext);

    return pathname === appContext.pathname;
};

export default useIsOnPath;
