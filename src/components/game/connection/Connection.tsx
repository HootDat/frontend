import io from 'socket.io-client';

class Connection {
  socket: SocketIOClient.Socket;
  errorHandler: () => void;

  constructor() {
    this.socket = io({ autoConnect: false });
    this.errorHandler = () => {};
  }

  init() {
    this.socket.open();
    this.addReconnectors();
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

  cleanup() {
    this.socket.close();
  }

  isConnected() {
    return this.socket.connected;
  }
}

export default Connection;
