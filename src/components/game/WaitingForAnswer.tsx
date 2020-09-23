import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';

import ProgressBarCountdownTimer from './common/ProgressBarCountdownTimer';
import GameContext from './GameContext';
import ScoreBoard from './common/ScoreBoard';

const WaitingForAnswer: React.FC = () => {
  const { state } = useContext(GameContext);
  const { players, host } = state!;

  return (
    <>
      <ProgressBarCountdownTimer countdownSeconds={60} />
      <Typography variant="h4">Waiting for hoot to answer...</Typography>
      <ScoreBoard header host={host!} players={players} />
    </>
  );
};

export default WaitingForAnswer;
