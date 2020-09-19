export default interface AuthState {
  access_token: string | null;
  name: string;
  setAuthState: (state: AuthState) => void;
}
