import { User } from '../../types/user';

export default interface AuthState {
  user: User | null;
  setAuthState: (state: AuthState) => void;
}
