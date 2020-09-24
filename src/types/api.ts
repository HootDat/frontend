import { CommunityQuestionPack } from './questionPack';

// Error response after extracting useful attributes
export interface ApiErrorResponse {
  code: number;
  body?: {
    error?: string;
    serverCopy?: CommunityQuestionPack;
  };
}
