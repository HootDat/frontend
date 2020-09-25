import { Category } from '../types/category';
import {
  CommunityQuestionPack,
  QuestionPackPostData,
} from '../types/questionPack';
import base from './base';

type getParams = {
  limit?: number;
  offset?: number;
  scope?: 'all' | 'own' | 'community';
  categories?: Category[];
};

const packsAPI = {
  getPacks: async (params: getParams): Promise<[CommunityQuestionPack]> => {
    return base.getData(`/packs`, params);
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
