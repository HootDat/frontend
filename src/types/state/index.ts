import { AuthState } from './auth';
import { ThunkAction } from 'redux-thunk';
import { CategoriesState } from './categories';
import { PacksState } from './packs';

export type AppState = {
  auth: AuthState;
  categories: CategoriesState;
  packs: PacksState;
};

declare module 'redux' {
  // Overload to add thunk support to Redux's dispatch() function.
  export interface Dispatch<A extends Action = AnyAction> {
    // tslint:disable-next-line
    <R, E>(thunk: ThunkAction<R, AppState, E, AnyAction>): R;
  }
}
