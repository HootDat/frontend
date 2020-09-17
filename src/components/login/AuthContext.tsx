import { createContext } from 'react';
import AuthState from './AuthState';

const AuthContext = createContext<AuthState>({} as AuthState);

export default AuthContext;
