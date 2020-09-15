import { createContext } from 'react';

import ConnManager from './ConnManager';

const ConnContext = createContext<ConnManager>({} as ConnManager);

export default ConnContext;
