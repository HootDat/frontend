import React, { useContext, useState } from 'react';
import { Typography, Button } from '@material-ui/core';

import ScoreBoard from './common/ScoreBoard';
import ConnContext from './connection/ConnContext';
import GameContext from './GameContext';

const RoundEnd: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  // participants should be updated with the updated scores already
  const { cId, state } = useContext(GameContext);

  const { curAnswerer, host, players, qnNum, results: fullResults } = state!;
  const results = fullResults[qnNum];
  const isLastRound = results.length === qnNum;
  const isAnswerer = curAnswerer === cId;

  const conn = useContext(ConnContext);

  const handleNextQuestion = () => {
    setIsReady(true);
    // TODO probably can remove, since there will be auto advance by the server
    conn.readyForNextRound();
  };

  const myResult = results.find(result => result.cId === cId)!;

  const header = () => {
    if (isAnswerer) {
      const numRight = results.filter(
        result => result.role === 'guesser' && result.answer === cId
      ).length;

      return <Typography variant="h6">{numRight} guessed it right!</Typography>;
    }

    return (
      <Typography variant="h6">
        You got it
        {myResult?.answer === curAnswerer! ? ' right :)' : ' wrong :('}
      </Typography>
    );
  };

  return (
    <>
      {header()}
      <ScoreBoard host={host!} results={results} players={players} />
      <Typography variant="h6">Who answered? </Typography>
      <ScoreBoard players={players} results={[myResult]} />
      <Button
        variant="contained"
        color="primary"
        disabled={isReady}
        onClick={handleNextQuestion}
      >
        {isReady
          ? 'WAITING FOR OTHERS'
          : isLastRound
          ? 'SUMMARY'
          : 'NEXT QUESTION'}
      </Button>
    </>
  );
};

export default RoundEnd;
