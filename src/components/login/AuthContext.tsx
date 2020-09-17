import { createContext } from 'react';
import AuthState from './AuthState';

const AuthContext = createContext<AuthState>({
  access_token: null,
  setAuthState: () => {},
});

export default AuthContext;
