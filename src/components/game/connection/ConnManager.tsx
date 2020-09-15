import Connection from './Connection';
import GameState, { Mode, home } from '../GameState';

const noOp = () => {};

// Processes and sends updates to and from the server.
class ConnManager {
  mode: Mode /* enum, ANSWERING, WAITING, LOBBY, etc. */;
  cid: string;

  roomId: string | null;
  participants: { [key: string]: [string, number] } /* cid, [name, icon] */;
  hostCid: string | null;
  currentQuestion: string | null;
  currentAnswer: string | null;

  // this probably will be removed. placeholder for testing
  round: number;
  questions: string[];

  conn: Connection;
  stateUpdater: (mode: GameState) => void;

  constructor() {
    // placeholders
    const {
      mode,
      participants,
      cid,
      roomId,
      hostCid,
      currentQuestion,
      currentAnswer,
    } = home();
    this.conn = new Connection();

    this.mode = mode;
    this.participants = participants;
    this.cid = cid;
    this.roomId = roomId;
    this.hostCid = hostCid;
    this.currentQuestion = currentQuestion;
    this.currentAnswer = currentAnswer;

    this.questions = [];
    this.round = 0;

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

  getGameState(): GameState {
    return { ...this };
  }

  setStateUpdater(stateUpdater: (mode: GameState) => void) {
    this.stateUpdater = stateUpdater;
  }

  push() {
    this.stateUpdater(this.getGameState());
  }

  resetAttributes() {
    const {
      mode,
      participants,
      cid,
      roomId,
      hostCid,
      currentQuestion,
      currentAnswer,
    } = home();

    this.mode = mode;
    this.participants = participants;
    this.cid = cid;
    this.roomId = roomId;
    this.hostCid = hostCid;
    this.currentQuestion = currentQuestion;
    this.currentAnswer = currentAnswer;
  }

  updateMode(mode: Mode) {
    this.mode = mode;
    if (mode === Mode.HOME) {
      this.resetAttributes();
    }
    this.push();
  }

  // this will probably emit an event. we need to wait for the server
  // to respond though, so might need to use a loading banner or something
  // until it gets the actual state update from the server?
  createRoom(name: string, hoot: number) {
    this.mode = Mode.WAITING_ROOM;
    this.roomId = '1234';
    this.hostCid = this.cid;
    this.participants = { [this.cid]: [name, hoot] };
    this.questions = [];
    this.push();
    return this.roomId;
  }

  joinRoom(roomId: string) {
    this.roomId = roomId;
    this.hostCid = 'cid2'; // someone else
    this.participants = {
      cid2: ['hostisme', 0],
      cid3: ['player2', 5],
    };
    this.questions = [
      'How long do you sleep?',
      'What is the first thing you do when you wake up',
      'I need better questions.',
    ];
    // TODO actually send to server
    this.push();
  }

  createPlayer(name: string, hoot: number) {
    this.participants = { ...this.participants, cid1: [name, hoot] };
    this.mode = Mode.WAITING_ROOM;
    this.push();
  }

  leaveRoom() {
    this.resetAttributes();
    this.mode = Mode.HOME;
    this.push();
  }

  startGame(questions: string[]) {
    this.questions = questions;
    this.mode = Mode.ANSWERING_QUESTION;
    this.currentQuestion = this.questions[this.round];
    this.push();
  }

  sendAnswer(answer: string) {
    this.currentAnswer = answer;
    this.mode = Mode.GUESSING_ANSWERER;
    this.push();
  }
}

export default ConnManager;
