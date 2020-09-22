import {
  CommunityQuestionPack,
  QuestionPackPostData,
} from '../types/questionPack';
import base from './base';
import { Category } from '../types/category';

// we remove unwrap and extract the name for categories and title for questions
const transformToSimplifiedFormat = (packObj: any) => ({
  ...packObj,
  categories: packObj.categories.map((categories: any) => categories.name),
  questions: packObj.questions.map((question: any) => question.title),
});

const packsAPI = {
  getPacks: (
    limit?: number,
    offset?: number,
    scope?: 'all' | 'private' | 'public',
    categories?: Category[]
  ): Promise<[CommunityQuestionPack]> => {
    return base
      .getData(`/packs`, { limit, offset, scope, categories })
      .then(packObjs => packObjs.map(transformToSimplifiedFormat));
  },

  newPack: (pack: QuestionPackPostData): Promise<CommunityQuestionPack> => {
    return base
      .postData('/packs', { ...pack })
      .then(transformToSimplifiedFormat);
  },

  editPack: (pack: QuestionPackPostData): Promise<CommunityQuestionPack> => {
    return base
      .putData(`/packs/${pack.id}`, { ...pack })
      .then(transformToSimplifiedFormat);
  },

  deletePack: (packId: number): Promise<{}> => {
    return base.delete(`/packs/${packId}`);
  },
};

export default packsAPI;
