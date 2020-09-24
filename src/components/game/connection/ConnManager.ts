import GameState, { Mode, reset, SocketGameState, Player } from '../GameState';
import io from 'socket.io-client';
import { Notification } from '../../common/notification/PushNotification';

const noOp = () => {};

// Processes and sends updates to and from the server.
class ConnManager {
  mode: Mode /* enum, ANSWERING, WAITING, LOBBY, etc. */;
  cId: string; // TODO put cId in local storage
  loading: boolean; // only used for joining and creating room at the start

  socket: SocketIOClient.Socket;
  stateUpdater: (mode: GameState) => void;
  state: SocketGameState | null;
  pushNotifier: (notif: Notification) => void;

  constructor() {
    // placeholders
    const { mode, cId, state } = reset();
    this.socket = io(process.env.REACT_APP_BACKEND_URL!, {
      query: {
        cId: cId,
      },
      autoConnect: false,
    });
    this.addReconnectors();
    this.addEventHandlers();
    this.addErrorHandlers();

    this.mode = mode;
    this.cId = cId;
    this.state = state;
    this.loading = false;

    this.stateUpdater = noOp;
    this.pushNotifier = noOp;
  }

  addReconnectors() {
    this.socket.on('reconnecting', () => {
      this.pushNotifier({ message: 'Reconnecting...', severity: 'info' });
    });

    this.socket.on('disconnect', () => {
      this.pushNotifier({
        message: 'Disconnected from server',
        severity: 'info',
      });
    });

    this.socket.on('reconnect', () => {
      this.pushNotifier({ message: 'Reconnected!', severity: 'success' });
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

  setPushNotifier(pushNotifier: (notif: Notification) => void) {
    this.pushNotifier = pushNotifier;
  }

  push() {
    this.stateUpdater(this.getGameState());
  }

  resetAttributes() {
    const { loading, mode, cId, state } = reset();

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
        return this.state.yourRole === 'answerer'
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

  // TODO handle on errors
  // TODO we are ignoring
  // game.event.questions.update
  // game.event.player.update

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

    this.socket.on('game.event.player.join', (player: Player) => {
      if (this.state === null) return; // error

      this.state = {
        ...this.state,
        players: { ...this.state.players, [player.cId]: player },
      };
      this.push();
    });

    this.socket.on('game.event.player.leave', (player: Player) => {
      if (this.state === null) return; // error

      this.state = { ...this.state, players: { ...this.state.players } };
      delete this.state.players[player.cId];
      this.push();
    });

    this.socket.on('game.event.transition', (gameState: SocketGameState) => {
      // note that this game state is PARTIAL
      // TODO what if i am actually in a different phase and
      // received the events out of order?
      this.state = { ...this.state!, ...gameState };
      this.mode = this.determineMode();
      this.push();
    });
  }

  // ignore game.leave.error (we left, we don't care.)
  // game.event.questions.update.error
  addErrorHandlers() {
    const someError = () => {
      this.pushNotifier({
        message: 'Something went wrong.',
        severity: 'error',
      });
      this.loading = false;
      this.push();
    };
    this.socket.on('game.create.error', someError);
    this.socket.on('game.event.host.start.error', someError);
    this.socket.on('game.event.player.answer.error', someError);
    this.socket.on('game.event.questions.update.error', someError);

    this.socket.on('game.join.error', (maybeMessage: string | undefined) => {
      if (maybeMessage === 'No such game exists.') {
        this.pushNotifier({
          message: 'This game code is invalid',
          severity: 'error',
        });
      } else {
        this.pushNotifier({
          message: 'Something went wrong',
          severity: 'error',
        });
      }
      this.loading = false;
      this.push();
    });

    this.socket.on('game.kick', () => {
      this.pushNotifier({
        message: 'Game room does not exist',
        severity: 'error',
      });
      this.loading = false;
      this.state = null;
      this.mode = Mode.HOME;
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
    this.socket.emit('game.leave', {
      gameCode: this.state!.gameCode,
    });
    this.state = null;
    this.loading = false;
    this.mode = Mode.HOME;
    this.push();
  }

  sendQuestions(questions: string[]) {
    this.socket.emit('game.event.questions.update', {
      gameCode: this.state!.gameCode,
      questions: questions,
    });
  }

  startGame() {
    this.socket.emit('game.event.host.start', {
      gameCode: this.state!.gameCode,
    });
  }

  sendAnswer(answer: string) {
    this.socket.emit('game.event.player.answer', {
      gameCode: this.state!.gameCode,
      answer: answer,
    });
  }

  guessAnswerer(answerer: string) {
    this.socket.emit('game.event.player.answer', {
      gameCode: this.state!.gameCode,
      answer: answerer,
    });
  }

  backToLobby() {
    this.socket.emit('game.event.host.playAgain', {
      gameCode: this.state!.gameCode,
    });
  }
}

export default ConnManager;
