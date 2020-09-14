import React, { useEffect, useState } from 'react';
import Home from './Home';
import GameManager from './GameManager';
import GameState, { Mode } from './GameState';
import { Button } from '@material-ui/core';
import GameContext from './GameContext';
import JoinRoom from './JoinRoom';
import CreateRoom from './CreateRoom';

const context = new GameManager();

const GameShell: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(context.getGameState());

  useEffect(() => {
    context.setStateUpdater(setGameState);
    context.connectToServer();

    // TODO: if there is a query pin, send in connection to join room immediately
    // and all other event handlers for the game events

    return () => {
      context.cleanup();
    };
  }, []);

  return (
    <GameContext.Provider value={context}>
      <Button onClick={() => context.push()}>{gameState.cid}</Button>
      {gameState.mode === Mode.HOME && <Home />}
      {gameState.mode === Mode.JOIN_ROOM && <JoinRoom />}
      {gameState.mode === Mode.CREATE_ROOM && <CreateRoom />}
    </GameContext.Provider>
  );
};

export default GameShell;
