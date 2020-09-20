import React, { useContext, useState } from 'react';
import { Typography, Button } from '@material-ui/core';

import ScoreBoard from './common/ScoreBoard';
import ConnContext from './connection/ConnContext';
import GameContext from './GameContext';

// TODO: Show who actually got it correct among everyone?
const RoundEnd: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  // participants should be updated with the updated scores already
  const {
    cid,
    hostCid,
    participants,
    currentGuesses,
    currentAnswerer,
  } = useContext(GameContext);

  const conn = useContext(ConnContext);

  const handleNextQuestion = () => {
    setIsReady(true);
    conn.readyForNextRound();
  };

  return (
    <>
      <Typography variant="h6">
        You got it
        {currentGuesses[cid] === currentAnswerer ? ' right :)' : ' wrong :('}
      </Typography>
      <ScoreBoard hostCid={hostCid!} participants={participants} />
      <Typography variant="h6">Who answered? </Typography>
      <ScoreBoard
        participants={{ [currentAnswerer!]: participants[currentAnswerer!] }}
      />
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
