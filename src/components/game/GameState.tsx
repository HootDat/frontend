export enum Mode {
  LOGGED_IN_ELSEWHERE,
  HOME,
  JOIN_ROOM,
  CREATE_ROOM,
  WAITING_ROOM,
  ANSWERING_QUESTION,
  WAITING_FOR_ANSWER,
  GUESSING_ANSWERER,
  ROUND_END,
  GAME_END,
}

export default interface GameState {
  mode: Mode /* determines the screen the client is on */;
  cid: string /* id to uniquely identify the client */;

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
  answers: Answer[];
  score: number;
};

export type SocketGameState = {
  gameCode: string;
  host: string;
  phase: string;
  qnNum: number;
  questions: string[];
  players: {
    [cid: string]: Player;
  };
  yourRole: 'guesser' | 'answerer' | '';
};

export function home(): GameState {
  return {
    mode: Mode.HOME,
    cid: 'cid1',
    state: null,
  };
}

export function getCurrentAnswerer(state: SocketGameState) {
  const qnNum = state.qnNum;
  const answerer = Object.values(state.players).find(
    player => player.answers[qnNum].type === 'answer'
  );
  return answerer
    ? { cid: answerer.cId, answer: answerer.answers[qnNum].content }
    : null;
}
