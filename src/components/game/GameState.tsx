export enum Mode {
  HOME,
  JOIN_ROOM,
  CREATE_ROOM,
  WAITING_ROOM,
}

export default interface GameState {
  mode: Mode /* determines the screen the client is on */;
  cid: string /* id to uniquely identify the client */;
  roomId: string | null;
  participants: { [key: string]: [string, number] } /* cid, [name, hoot] */;
  hostCid: string | null;
}

export function home(): GameState {
  return {
    mode: Mode.HOME,
    cid: '1234',
    roomId: null,
    participants: {},
    hostCid: null,
  };
}
