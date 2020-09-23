import GameState, { Mode, home, SocketGameState, Player } from '../GameState';
import io from 'socket.io-client';

const noOp = () => {};

// Processes and sends updates to and from the server.
class ConnManager {
  mode: Mode /* enum, ANSWERING, WAITING, LOBBY, etc. */;
  cId: string; // TODO put cId in local storage
  loading: boolean;

  socket: SocketIOClient.Socket;
  stateUpdater: (mode: GameState) => void;
  state: SocketGameState | null;

  constructor() {
    // placeholders
    const { mode, cId, state } = home();
    this.socket = io({ autoConnect: false });
    this.addReconnectors();
    this.addEventHandlers();

    this.mode = mode;
    this.cId = cId;
    this.state = state;
    this.loading = false;

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

  getGameState(): GameState {
    return { ...this };
  }

  setStateUpdater(stateUpdater: (mode: GameState) => void) {
    this.stateUpdater = stateUpdater;
    this.push();
  }

  push() {
    this.stateUpdater(this.getGameState());
  }

  resetAttributes() {
    const { loading, mode, cId, state } = home();

    this.mode = mode;
    this.cId = cId;
    this.loading = loading;
    this.state = state;
  }

  updateMode(mode: Mode) {
    this.mode = mode;
    if (mode === Mode.HOME) {
      this.resetAttributes();
    }
    this.push();
  }

  /** Determine the current screen to show based off the state
   *  This is primarily for when joining in the middle of a game
   *
   */
  determineMode() {
    if (this.state === null) {
      return Mode.HOME;
    }

    switch (this.state.phase) {
      case 'lobby':
        return Mode.WAITING_ROOM;
      case 'answer':
        return this.state.curAnswerer === this.cId
          ? Mode.ANSWERING_QUESTION
          : Mode.WAITING_FOR_ANSWER;
      case 'guess':
        return Mode.GUESSING_ANSWERER;
      case 'results':
        return Mode.ROUND_END;
      case 'end':
        return Mode.GAME_END;
    }
  }

  addEventHandlers() {
    this.socket.on('auth.loggedInElsewhere', () => {
      this.state = null;
      this.loading = false;
      this.mode = Mode.LOGGED_IN_ELSEWHERE;
      this.push();
    });

    this.socket.on('game.join', (gameState: SocketGameState) => {
      this.state = gameState;
      this.mode = this.determineMode();
      this.loading = false;
      this.push();
    });

    this.socket.on('game.event.join', (player: Player) => {
      if (this.state === null) return; // error

      this.state.players[player.cId] = player;
      this.push();
    });

    this.socket.on('game.event.leave', (player: Player) => {
      if (this.state === null) return; // error

      delete this.state.players[player.cId];
      this.push();
    });
  }

  createRoom(name: string, iconNum: number) {
    this.socket.emit('game.create', { name: name, iconNum: iconNum });
    this.loading = true;
    this.push();
  }

  joinRoom(gameCode: string, name: string, iconNum: number) {
    this.socket.emit('game.join', {
      gameCode: gameCode,
      name: name,
      iconNum: iconNum,
    });
    this.loading = true;
    this.push();
  }

  leaveRoom() {
    this.socket.emit('game.leave');
    this.state = null;
    this.loading = false;
    this.mode = Mode.HOME;
    this.push();
  }

  startGame(questions: string[]) {
    this.state = { ...this.state!, questions: questions };
    this.mode = Mode.ANSWERING_QUESTION;
    this.loading = true;
    this.push();
  }

  sendAnswer(answer: string) {
    this.state = { ...this.state! };
    this.state.curAnswer = answer;
    this.state.curAnswerer = this.cId;
    /*
    {
      type: 'answer',
      content: answer,
    }
    */
    this.mode = Mode.GUESSING_ANSWERER;
    this.push();
  }

  guessAnswerer(answerer: string) {
    this.state = { ...this.state! };
    this.state.results.push([
      { cId: this.cId, score: 1, answer: answerer, role: this.state!.yourRole },
    ]);
    /*
      type: 'guess',
      content: answerer,
    }*/
    this.mode = Mode.ROUND_END;
    this.push();
  }

  readyForNextRound() {
    this.state = { ...this.state! };
    this.state.qnNum++;
    if (this.state.qnNum >= this.state.questions.length) {
      this.state.qnNum = 0;
      this.state.curAnswer = '';
      this.state.curAnswerer = '';
      this.mode = Mode.GAME_END;
    } else {
      this.mode = Mode.ANSWERING_QUESTION;
    }
    this.push();
  }
}

export default ConnManager;
