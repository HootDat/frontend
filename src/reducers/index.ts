import { combineReducers, Action } from 'redux';
import authReducer from './auth';
import categoriesReducer from './categories';
import packsReducer from './packs';

// Top-level reducers

const rootReducer = combineReducers({
  auth: authReducer,
  categories: categoriesReducer,
  packs: packsReducer,
});

export default rootReducer;
