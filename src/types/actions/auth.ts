import { Action } from 'redux';
import { User } from '../user';

export type AuthSuccessAction = Action & {
  payload: {
    user: User;
  };
};

export type AuthResponseAction = Action | AuthSuccessAction;
