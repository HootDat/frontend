import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';

import ProgressBarCountdownTimer from './common/ProgressBarCountdownTimer';
import GameContext from './GameContext';
import ScoreBoard from './common/ScoreBoard';

const WaitingForAnswer: React.FC = () => {
  const { participants, hostCid } = useContext(GameContext);

  return (
    <>
      <ProgressBarCountdownTimer countdownSeconds={60} />
      <Typography variant="h4">Waiting for hoot to answer...</Typography>
      <ScoreBoard header hostCid={hostCid!} participants={participants} />
    </>
  );
};

export default WaitingForAnswer;
