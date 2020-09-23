import GameState, { Mode, home, SocketGameState } from '../GameState';

const noOp = () => {};

// Processes and sends updates to and from the server.
class ConnManager {
  mode: Mode /* enum, ANSWERING, WAITING, LOBBY, etc. */;
  cid: string; // TODO put cid in local storage

  socket: SocketIOClient.Socket;
  stateUpdater: (mode: GameState) => void;
  state: SocketGameState | null;

  constructor() {
    // placeholders
    const { mode, cid, state } = home();
    this.socket = io({ autoConnect: false });
    this.addReconnectors();

    this.mode = mode;
    this.cid = cid;
    this.state = state;

    this.stateUpdater = noOp;
  }

  addReconnectors() {
    this.socket.on('reconnecting', () => {
      // TODO: on reconnecting, display disconencted, reconnecting banner
      console.log('failed to connect to server, reconnecting');
    });

    this.socket.on('disconnect', () => {
      // TODO: on disconnect, display disconnected, reconnecting banner
      console.log('server disconnected, reconnecting');
    });

    this.socket.on('reconnect', () => {
      // TODO: on reconnect, display reconnected banner
      console.log('reconnected!');
    });
  }

  isConnected() {
    return this.socket.connected;
  }

  connectToServer() {
    this.socket.open();
  }

  cleanup() {
    this.stateUpdater = noOp;
    this.socket.close();
  }

  addMetaEventHandlers() {
    this.socket.on('auth.loggedInElsewhere', () => {
      this.mode = Mode.LOGGED_IN_ELSEWHERE;
      this.push();
    });

    // this.socket.on('game.join', game);
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
    const { mode, cid, state } = home();

    this.mode = mode;
    this.cid = cid;

    this.state = state;
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
    this.state = {
      gameCode: '1234',
      host: this.cid,
      players: {
        [this.cid]: {
          cId: this.cid,
          name: name,
          iconNum: hoot,
          answers: [],
          score: 0,
          online: true,
        },
      },
      questions: [],
      qnNum: 0,
      phase: '',
      yourRole: '',
    };
    this.push();
    return this.state?.gameCode;
  }

  joinRoom(gameCode: string, name: string, iconNum: number) {
    this.state = {
      gameCode: gameCode,
      host: 'cid2',
      players: {
        cid2: {
          cId: 'cid2',
          name: 'hostisme',
          iconNum: 0,
          answers: [],
          score: 0,
          online: true,
        },
        cid3: {
          cId: 'cid3',
          name: 'player2',
          iconNum: 5,
          answers: [],
          score: 2,
          online: true,
        },
        [this.cid]: {
          cId: this.cid,
          name: name,
          iconNum: iconNum,
          answers: [],
          score: 0,
          online: true,
        },
      },
      questions: [],
      qnNum: 0,
      phase: '',
      yourRole: '',
    };
    this.mode = Mode.WAITING_ROOM;
    // TODO actually send to server
    this.push();
  }

  leaveRoom() {
    this.resetAttributes();
    this.mode = Mode.HOME;
    this.push();
  }

  startGame(questions: string[]) {
    this.state = { ...this.state!, questions: questions };
    this.mode = Mode.ANSWERING_QUESTION;
    this.push();
  }

  sendAnswer(answer: string) {
    this.state = { ...this.state! };
    this.state.players[this.cid].answers.push({
      type: 'answer',
      content: answer,
    });
    this.mode = Mode.GUESSING_ANSWERER;
    this.push();
  }

  guessAnswerer(answerer: string) {
    this.state = { ...this.state! };
    this.state.players[this.cid].answers.push({
      type: 'guess',
      content: answerer,
    });
    this.mode = Mode.ROUND_END;
    this.push();
  }

  readyForNextRound() {
    this.state = { ...this.state! };
    this.state.qnNum++;
    if (this.state.qnNum >= this.state.questions.length) {
      this.state.qnNum = 0;
      this.mode = Mode.GAME_END;
    } else {
      this.mode = Mode.ANSWERING_QUESTION;
    }
    this.push();
  }
}

export default ConnManager;
