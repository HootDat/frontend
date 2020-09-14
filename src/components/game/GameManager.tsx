import Connection from './Connection';
import GameState, { Mode } from './GameState';

const noOp = () => {};

class GameManager {
  mode: Mode /* enum, ANSWERING, WAITING, LOBBY, etc. */;
  roomId: string | null;
  cid: string;
  participants: { [key: string]: [string, number] } /* cid, [name, icon] */;
  hostCid: string | null;

  conn: Connection;
  stateUpdater: (mode: GameState) => void;

  constructor() {
    // placeholders
    this.mode = Mode.HOME;
    this.conn = new Connection();
    this.participants = {};
    this.cid = '123';
    this.roomId = null;
    this.hostCid = null;
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
    const { mode, roomId, cid, participants, hostCid } = this;
    return { mode, roomId, cid, participants, hostCid };
  }

  setStateUpdater(stateUpdater: (mode: GameState) => void) {
    this.stateUpdater = stateUpdater;
  }

  push() {
    this.stateUpdater(this.getGameState());
  }

  resetAttributes() {
    this.participants = {};
    this.roomId = null;
    this.hostCid = null;
  }

  updateMode(mode: Mode) {
    this.mode = mode;
    if (mode === Mode.HOME) {
      this.resetAttributes();
    }
    this.push();
  }

  createRoom(name: string, hoot: number) {
    this.mode = Mode.HOME;
    this.push();
  }

  joinRoom(roomId: string) {
    this.roomId = roomId;
    // TODO actually send to server
    this.push();
  }
}

export default GameManager;
