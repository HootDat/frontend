import base from './base';
import { Category } from '../types/category';

const categoriesAPI = {
  getCategories: async (): Promise<[Category]> => {
    // we get back an array of category objects, but we only want the name
    return base
      .getData('/categories')
      .then(categoryObjs => categoryObjs.map((category: any) => category.name));
  },
};

export default categoriesAPI;
