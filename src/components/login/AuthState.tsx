export default interface AuthState {
  access_token: string | null;
  setAuthState: (state: AuthState) => void;
}
