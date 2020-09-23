import React, { useContext, useState } from 'react';
import { Typography, Button } from '@material-ui/core';

import ScoreBoard from './common/ScoreBoard';
import ConnContext from './connection/ConnContext';
import GameContext from './GameContext';
import { getCurrentAnswerer } from './GameState';

// TODO: Show who actually got it correct among everyone?
const RoundEnd: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  // participants should be updated with the updated scores already
  const { cid, state } = useContext(GameContext);

  const { host, players, qnNum } = state!;

  const conn = useContext(ConnContext);

  const handleNextQuestion = () => {
    setIsReady(true);
    conn.readyForNextRound();
  };

  const { cid: answerer } = getCurrentAnswerer(state!)!;
  const myGuess = players[cid].answers[qnNum].content;

  return (
    <>
      <Typography variant="h6">
        You got it
        {myGuess === answerer! ? ' right :)' : ' wrong :('}
      </Typography>
      <ScoreBoard host={host!} players={players} />
      <Typography variant="h6">Who answered? </Typography>
      <ScoreBoard players={{ [answerer!]: players[answerer!] }} />
      <Button
        variant="contained"
        color="primary"
        disabled={isReady}
        onClick={handleNextQuestion}
      >
        {isReady ? 'WAITING FOR OTHERS' : 'NEXT QUESTION'}
      </Button>
    </>
  );
};

export default RoundEnd;
