import React, { useEffect } from 'react';
import io from 'socket.io-client';
import Home from './Home';

const GameShell: React.FC = () => {
  useEffect(() => {
    const socket = io();

    // TODO: setup error handlers for each event
    // TODO: if there is a query pin, send in connection to join room immediately
    // TODO: on reconnecting, display disconencted, reconnecting
    // on reconnect, display reconnected
    // on reconnect_failed, display fail, redirect to home
    // and all other event handlers for the game events

    return () => {
      socket.close();
    };
  }, []);
  return <Home />;
};

export default GameShell;
