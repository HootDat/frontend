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
import { useLocation, useHistory } from 'react-router-dom';

const conn = new ConnManager();

const GameShell: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(conn.getGameState());
  const { cid, mode } = gameState;

  const history = useHistory();
  const roomId = new URLSearchParams(useLocation().search).get('roomId');

  useEffect(() => {
    conn.setStateUpdater(setGameState);
    conn.connectToServer();

    // we only want to auto join a room on load, so don't depend
    // on history and roomid
    const re = /^[0-9]{4}$/;
    if (roomId !== null && re.test(roomId)) {
      conn.updateMode(Mode.JOIN_ROOM);
      conn.joinRoom(roomId);
    } else if (roomId !== null) {
      history.replace('/');
    }

    return () => {
      conn.cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
