export enum Mode {
  LOGGED_IN_ELSEWHERE,
  HOME,
  JOIN_ROOM,
  CREATE_ROOM,

  // in game states
  WAITING_ROOM,
  ANSWERING_QUESTION,
  WAITING_FOR_ANSWER,
  GUESSING_ANSWERER,
  ROUND_END,
  GAME_END,
}

export default interface GameState {
  mode: Mode /* determines the screen the client is on */;
  cId: string /* id to uniquely identify the client */;
  loading: boolean;
  state: SocketGameState | null;
}

export type Answer = {
  type: 'answer' | 'guess';
  content: string;
};

export type Player = {
  cId: string;
  name: string;
  iconNum: number;
  online: boolean;
};

export type Role = 'guesser' | 'answerer' | '';

export type Result = {
  cId: string;
  score: number;
  answer: string;
  role: Role;
};

export type Phase = 'lobby' | 'answer' | 'guess' | 'results' | 'end';

export type SocketGameState = {
  yourRole: Role;
  gameCode: string;
  host: string;
  qnNum: number;
  phase: Phase;
  questions: string[];
  currAnswer: string;
  currAnswerer: string;
  results: { [cId: string]: Result }[];
  players: {
    [cId: string]: Player;
  };
};

export function home(): GameState {
  return {
    mode: Mode.HOME,
    loading: false,
    cId: 'cId1', // TODO generate own uuid
    state: null,
  };
}
