import React, { useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';

import ConnContext from './connection/ConnContext';
import ConnManager from './connection/ConnManager';
import ChatShell from './ChatShell';
import CreateRoom from './CreateRoom';
import WaitingRoom from './WaitingRoom';
import GameContext from './GameContext';
import GameState, { Mode } from './GameState';
import Home from './Home';
import JoinRoom from './JoinRoom';
import AnsweringQuestion from './AnsweringQuestion';
import WaitingForAnswer from './WaitingForAnswer';
import GuessingAnswerer from './GuessingAnswerer';

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

  const render = () => {
    const wrapInChatShell = (element: JSX.Element) => (
      <ChatShell>{element}</ChatShell>
    );

    switch (mode) {
      case Mode.HOME:
        return <Home />;
      case Mode.JOIN_ROOM:
        return <JoinRoom />;
      case Mode.CREATE_ROOM:
        return <CreateRoom />;
      case Mode.WAITING_ROOM:
        return wrapInChatShell(<WaitingRoom />);
      case Mode.ANSWERING_QUESTION:
        return wrapInChatShell(<AnsweringQuestion />);
      case Mode.WAITING_FOR_ANSWER:
        return wrapInChatShell(<WaitingForAnswer />);
      case Mode.GUESSING_ANSWERER:
        return wrapInChatShell(<GuessingAnswerer />);
    }
  };

  return (
    <GameContext.Provider value={gameState}>
      <ConnContext.Provider value={conn}>
        <Button onClick={() => conn.push()}>{cid}</Button>
        {render()}
      </ConnContext.Provider>
    </GameContext.Provider>
  );
};

export default GameShell;
