export enum Mode {
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
  roomId: string | null;
  participants: {
    [key: string]: [string, number, number];
  } /* cid, [name, hoot, score] */;
  hostCid: string | null;
  currentQuestion: string | null;
  currentAnswer: string | null;
}

export function home(): GameState {
  return {
    mode: Mode.HOME,
    cid: 'cid1',
    roomId: null,
    participants: {},
    hostCid: null,
    currentQuestion: null,
    currentAnswer: null,
  };
}
