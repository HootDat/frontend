import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';

import ProgressBarCountdownTimer from './common/ProgressBarCountdownTimer';
import GameContext from './GameContext';
import ScoreBoard from './common/ScoreBoard';

const WaitingForAnswer: React.FC = () => {
  const { state } = useContext(GameContext);
  const { results: fullResults, qnNum, players, host } = state!;
  // -1 as we are showing previous round's results
  const results = fullResults[qnNum - 1];

  return (
    <>
      <ProgressBarCountdownTimer countdownSeconds={60} />
      <Typography variant="h4">Waiting for hoot to answer...</Typography>
      <ScoreBoard header host={host!} results={results} players={players} />
    </>
  );
};

export default WaitingForAnswer;
