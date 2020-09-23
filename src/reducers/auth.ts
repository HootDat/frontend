import { AuthState } from '../types/state/auth';
import { AuthResponseAction, AuthSuccessAction } from '../types/actions/auth';
import { LOGIN_SUCCESS } from '../actions/constants';

const initialState: AuthState = {
  user: null,
};

const authReducer = (
  state: AuthState = initialState,
  action: AuthResponseAction
): AuthState => {
  switch (action.type) {
    case LOGIN_SUCCESS: {
      return { ...state, user: (action as AuthSuccessAction).payload.user };
    }

    default:
      return state;
  }
};

export default authReducer;
