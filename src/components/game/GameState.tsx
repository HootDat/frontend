export enum Mode {
  HOME,
  JOIN_ROOM,
  CREATE_ROOM,
  WAITING_ROOM,
}

export default interface GameState {
  mode: Mode /* enum, ANSWERING, WAITING, LOBBY, etc. */;
  roomId: string | null;
  cid: string;
  participants: { [key: string]: [string, number] } /* cid, [name, icon] */;
  hostCid: string | null;
}
