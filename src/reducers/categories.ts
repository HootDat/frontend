import { CategoriesState } from '../types/state/categories';
import {
  CategoriesResponseAction,
  FetchCategoriesSuccessAction,
} from '../types/actions/categories';
import { FETCH_CATEGORIES_SUCCESS } from '../actions/constants';

const initialState: CategoriesState = {
  categories: [],
};

export const categoriesReducer = (
  state: CategoriesState = initialState,
  action: CategoriesResponseAction
): CategoriesState => {
  switch (action.type) {
    case FETCH_CATEGORIES_SUCCESS: {
      const categories = (action as FetchCategoriesSuccessAction).payload.items;
      return {
        categories: categories,
      };
    }
    default:
      return state;
  }
};

export default categoriesReducer;
