import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

import ConnContext from './connection/ConnContext';
import ConnManager from './connection/ConnManager';
import AnsweringQuestion from './AnsweringQuestion';
import ChatShell from './ChatShell';
import CreateRoom from './CreateRoom';
import WaitingRoom from './WaitingRoom';
import GameContext from './GameContext';
import GameState, { Mode } from './GameState';
import GuessingAnswerer from './GuessingAnswerer';
import Home from './Home';
import JoinRoom from './JoinRoom';
import WaitingForAnswer from './WaitingForAnswer';
import RoundEnd from './RoundEnd';
import GameEnd from './GameEnd';
import PaddedDiv from '../common/PaddedDiv';
import LoggedInElsewhere from './LoggedInElsewhere';

import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import PushNotification from '../common/notification/PushNotification';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const conn = new ConnManager();

const GameShell: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(conn.getGameState());
  const { loading, mode, state } = gameState;

  const pushNotifier = useContext(PushNotification);

  const history = useHistory();
  const gameCode = new URLSearchParams(useLocation().search).get('gameCode');

  const classes = useStyles();

  useEffect(() => {
    conn.setStateUpdater(setGameState);
    conn.setPushNotifier(pushNotifier);
    conn.connectToServer();

    // we only want to auto join a room on load, so don't depend
    // on history and gamecode
    const re = /^[0-9]{4}$/;
    if (gameCode !== null && re.test(gameCode)) {
      conn.updateMode(Mode.JOIN_ROOM);
    } else if (gameCode !== null) {
      history.push('/');
    }

    return () => {
      conn.cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // we only keep make the gameCode stay in the url if in game
  useEffect(() => {
    if (state && state.gameCode) {
      history.push(`/?gameCode=${state.gameCode}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // TODO we should disallow users from creating rooms when connection is
  // down
  const render = () => {
    const wrapInChatShell = (element: JSX.Element) => (
      <ChatShell>{element}</ChatShell>
    );

    switch (mode) {
      case Mode.LOGGED_IN_ELSEWHERE:
        return <LoggedInElsewhere />;
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
      case Mode.ROUND_END:
        return wrapInChatShell(<RoundEnd />);
      case Mode.GAME_END:
        return wrapInChatShell(<GameEnd />);
      default:
        return <></>;
    }
  };

  return (
    <GameContext.Provider value={gameState}>
      <ConnContext.Provider value={conn}>
        <Backdrop open={loading} className={classes.backdrop}>
          <CircularProgress />
        </Backdrop>
        <PaddedDiv>{render()}</PaddedDiv>
      </ConnContext.Provider>
    </GameContext.Provider>
  );
};

export default GameShell;
