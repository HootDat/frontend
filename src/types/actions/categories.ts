import { Action } from 'redux';
import { Category } from '../category';

export type FetchCategoriesSuccessAction = Action & {
  payload: {
    items: Category[];
  };
};

export type CategoriesResponseAction = Action | FetchCategoriesSuccessAction;
