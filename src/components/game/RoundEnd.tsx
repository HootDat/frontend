import React, { useContext, useState } from 'react';
import { Typography, Button } from '@material-ui/core';

import ScoreBoard from './common/ScoreBoard';
import ConnContext from './connection/ConnContext';
import GameContext from './GameContext';

// TODO: Show who actually got it correct among everyone?
const RoundEnd: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  // participants should be updated with the updated scores already
  const { cId, state } = useContext(GameContext);

  const { curAnswerer, host, players, qnNum, results: fullResults } = state!;
  const results = fullResults[qnNum];

  const conn = useContext(ConnContext);

  const handleNextQuestion = () => {
    setIsReady(true);
    conn.readyForNextRound();
  };

  const myResult = results.find(result => result.cId === cId)!;

  // TODO since answerer shouldnt answer, they should not see who got it right
  // or wrong
  return (
    <>
      <Typography variant="h6">
        You got it
        {myResult?.answer === curAnswerer! ? ' right :)' : ' wrong :('}
      </Typography>
      <ScoreBoard host={host!} results={results} players={players} />
      <Typography variant="h6">Who answered? </Typography>
      <ScoreBoard players={players} results={[myResult]} />
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
