import {
  CommunityQuestionPack,
  QuestionPackPostData,
} from '../types/questionPack';
import base from './base';
import { Category } from '../types/category';

const packsAPI = {
  getPacks: (
    limit?: number,
    offset?: number,
    scope?: 'all' | 'private' | 'public',
    categories?: Category[]
  ): Promise<[CommunityQuestionPack]> => {
    return base.getData(`/packs`, { limit, offset, scope, categories });
  },

  PackNew: (pack: QuestionPackPostData): Promise<CommunityQuestionPack> => {
    return base.postData('/packs', { ...pack });
  },

  PackEdit: (pack: QuestionPackPostData): Promise<CommunityQuestionPack> => {
    return base.putData(`/packs/${pack.id}`, { ...pack });
  },

  deletePack: (packId: number): Promise<{}> => {
    return base.delete(`/packs/${packId}`);
  },
};

export default packsAPI;
