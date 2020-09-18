import { User } from './user';
import { Category } from './category';

export type QuestionPack = QuestionPackPostData & {
  owner: User;
  updated_at: string;
};

export type QuestionPackPostData = {
  id: number;
  name: string;
  categories: Category[];
  questions: string[];
  public: boolean;
};
