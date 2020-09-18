import { QuestionPack, QuestionPackPostData } from '../types/questionPack';
import base from './base';
import { Category } from '../types/category';

const packsAPI = {
  getPacks: (
    limit?: number,
    offset?: number,
    scope?: 'all' | 'private' | 'public',
    categories?: Category[]
  ): Promise<[QuestionPack]> => {
    return base.getData(`/packs`, { limit, offset, scope, categories });
  },

  newPack: (pack: QuestionPackPostData): Promise<QuestionPack> => {
    return base.postData('/packs', { ...pack });
  },

  editPack: (pack: QuestionPackPostData): Promise<QuestionPack> => {
    return base.putData(`/packs/${pack.id}`, { ...pack });
  },

  deletePack: (packId: number): Promise<{}> => {
    return base.delete(`/packs/${packId}`);
  },
};

export default packsAPI;
