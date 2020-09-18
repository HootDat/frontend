import base from './base';
import { Category } from '../types/category';

const categoriesAPI = {
  getCategories: (): Promise<[Category]> => {
    return base.getData('/categories');
  },
};

export default categoriesAPI;
