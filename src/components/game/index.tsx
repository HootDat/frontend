import React, { useEffect, useState } from 'react';
import { Button } from '@material-ui/core';

import ConnContext from './connection/ConnContext';
import ConnManager from './connection/ConnManager';
import CreateRoom from './CreateRoom';
import WaitingRoom from './WaitingRoom';
import GameContext from './GameContext';
import GameState, { Mode } from './GameState';
import Home from './Home';
import JoinRoom from './JoinRoom';

const conn = new ConnManager();

const GameShell: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(conn.getGameState());

  const { cid, mode } = gameState;

  useEffect(() => {
    conn.setStateUpdater(setGameState);
    conn.connectToServer();

    // TODO: if there is a query pin, send in connection to join room immediately
    // and all other event handlers for the game events

    return () => {
      conn.cleanup();
    };
  }, []);

  return (
    <GameContext.Provider value={gameState}>
      <ConnContext.Provider value={conn}>
        <Button onClick={() => conn.push()}>{cid}</Button>
        {mode === Mode.HOME && <Home />}
        {mode === Mode.JOIN_ROOM && <JoinRoom />}
        {mode === Mode.CREATE_ROOM && <CreateRoom />}
        {mode === Mode.WAITING_ROOM && <WaitingRoom />}
      </ConnContext.Provider>
    </GameContext.Provider>
  );
};

export default GameShell;
