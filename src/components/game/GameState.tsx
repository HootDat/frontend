export enum Mode {
  HOME,
  JOIN_ROOM,
  CREATE_ROOM,
}

export default interface GameState {
  mode: Mode /* enum, ANSWERING, WAITING, LOBBY, etc. */;
  room?: string;
  cid: string;
  participants: { [key: string]: [string, number] } /* cid, [name, icon] */;
  host_cid?: string;
}
