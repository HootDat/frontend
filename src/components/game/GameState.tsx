import { v4 as uuid } from 'uuid';
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

const CLIENT_ID = 'cId';
export function reset(): GameState {
  let cId;
  try {
    let maybeCId = localStorage.getItem(CLIENT_ID);
    if (maybeCId === null) {
      cId = uuid();
      localStorage.setItem(CLIENT_ID, cId);
    } else {
      cId = maybeCId;
    }
  } catch (e) {
    // no local storage
    cId = uuid();
  }
  return {
    mode: Mode.HOME,
    loading: false,
    cId,
    state: null,
  };
}
