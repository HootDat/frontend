import { Category } from '../types/category';
import {
  CommunityQuestionPack,
  QuestionPackPostData,
} from '../types/questionPack';
import base from './base';

const packsAPI = {
  getPacks: async (
    limit?: number,
    offset?: number,
    scope?: 'all' | 'own' | 'community',
    categories?: Category[]
  ): Promise<[CommunityQuestionPack]> => {
    return base.getData(`/packs`, { limit, offset, scope, categories });
  },

  newPack: async (
    pack: QuestionPackPostData
  ): Promise<CommunityQuestionPack> => {
    return base.postData('/packs', { ...pack });
  },

  editPack: async (
    pack: QuestionPackPostData
  ): Promise<CommunityQuestionPack> => {
    return base.putData(`/packs/${pack.id}`, { ...pack });
  },

  deletePack: async (packId: number): Promise<{}> => {
    return base.delete(`/packs/${packId}`);
  },
};

export default packsAPI;
