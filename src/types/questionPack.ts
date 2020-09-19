import { User } from './user';
import { Category } from './category';

export type QuestionPack = CommunityQuestionPack | LocalQuestionPack;

export type CommunityQuestionPack = QuestionPackPostData & {
  owner: User;
  updated_at: string;
};

// for an owned pack that is not synced to the server, id is negative.
export type QuestionPackPostData = {
  id: number;
  name: string;
  categories: Category[];
  questions: string[];
  public: boolean;
};

// none   - packs that were synced from server, and no changes were made
// new    - packs created locally, but have not been pushed to server
// edit   - packs that have been edited after syncing from server
// delete - packs that have been deleted locally, but have not been synced to server
export type LocalQuestionPack = CommunityQuestionPack & {
  action: 'none' | 'new' | 'edit' | 'delete';
};

// strictly local just QuestionPackPostData with an invalid id (uuid)
// if id is invalid, dont need to track changes

// if id is valid, then need to track changes
// with change and updated_at

// on logout, delete all local packs
// on login, download all owned packs and store locally
