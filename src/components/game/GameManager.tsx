import Connection from './Connection';
import GameState, { Mode } from './GameState';

const noOp = () => {};

class GameManager {
  mode: Mode /* enum, ANSWERING, WAITING, LOBBY, etc. */;
  room?: string;
  cid: string;
  participants: { [key: string]: [string, number] } /* cid, [name, icon] */;
  host_cid?: string;

  conn: Connection;
  stateUpdater: (mode: GameState) => void;

  constructor() {
    // placeholders
    this.mode = Mode.HOME;
    this.cid = '123';
    this.room = '1234';
    this.participants = {};
    this.conn = new Connection();
    this.stateUpdater = noOp;
  }

  isConnected() {
    return this.conn.isConnected();
  }

  connectToServer() {
    this.conn.init();
  }

  cleanup() {
    this.stateUpdater = noOp;
    this.conn.cleanup();
  }

  getGameState() {
    const { mode, room, cid, participants } = this;
    return { mode, room, cid, participants };
  }

  setStateUpdater(stateUpdater: (mode: GameState) => void) {
    this.stateUpdater = stateUpdater;
  }

  push() {
    this.stateUpdater(this.getGameState());
  }

  updateMode(mode: Mode) {
    this.mode = mode;
    this.push();
  }

  createRoom(name: string, hoot: number) {
    this.mode = Mode.HOME;
    this.push();
  }

  joinRoom(roomId: string) {
    this.mode = Mode.HOME;
    this.push();
  }
}

export default GameManager;
