import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Button } from '@material-ui/core';

import ScoreBoard from './common/ScoreBoard';
import ConnContext from './connection/ConnContext';
import GameContext from './GameContext';
import { Mode } from './GameState';

const GameEnd: React.FC = () => {
  const { state } = useContext(GameContext);

  const { results: fullResults, qnNum, players } = state!;
  const results = fullResults[qnNum];

  const conn = useContext(ConnContext);

  const history = useHistory();

  const handlePlayAgain = () => {
    conn.updateMode(Mode.WAITING_ROOM);
  };

  const handleQuit = () => {
    conn.updateMode(Mode.HOME);
    history.replace('/');
  };

  // TODO FACEBOOK SHARE?
  return (
    <>
      <Typography variant="h4">Final Scoreboard</Typography>
      <Typography variant="body1">{"Who's the best hoot?"}</Typography>
      <ScoreBoard winning results={results} players={players} />
      <Button variant="contained" color="primary" onClick={handlePlayAgain}>
        PLAY AGAIN
      </Button>
      <Button color="primary" onClick={handleQuit}>
        QUIT
      </Button>
    </>
  );
};

export default GameEnd;
