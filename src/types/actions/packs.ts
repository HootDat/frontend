import { Action } from 'redux';
import { CommunityQuestionPack } from '../questionPack';

export type FetchPacksSuccessAction = Action & {
  payload: {
    items: CommunityQuestionPack[];
  };
};

export type SavePackSuccessAction = Action & {
  payload: {
    item: CommunityQuestionPack;
  };
};

export type DeletePackSuccessAction = Action & {
  payload: {
    item: number;
  };
};

export type PacksResponseAction = Action | FetchPacksSuccessAction;
export type PackResponseAction =
  | Action
  | SavePackSuccessAction
  | DeletePackSuccessAction;
