import { ThunkAction } from 'redux-thunk';
import { AppState } from '../types/state';
import { AuthResponseAction, AuthSuccessAction } from '../types/actions/auth';
import { Dispatch } from 'redux';
import authAPI from '../api/auth';
import { User } from '../types/user';
import { LOGIN_SUCCESS } from './constants';

export const loginRequest = (): ((
  accessToken: string
) => ThunkAction<Promise<void>, AppState, void, AuthResponseAction>) => {
  return (accessToken: string) => async (dispatch: Dispatch) => {
    try {
      const user = await authAPI.postLogin(accessToken);

      if (user) {
        dispatch(loginSuccess(user));
      }
    } catch (err) {
      // TODO
    }
  };
};

export const loginSuccess = (user: User): AuthSuccessAction => ({
  type: LOGIN_SUCCESS,
  payload: {
    user,
  },
});
