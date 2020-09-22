export default interface AuthState {
  access_token: string | null;
  name: string | null;
  id: number | null;
  setAuthState: (state: AuthState) => void;
}
