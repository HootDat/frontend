import React, { useState, useContext } from 'react';
import { Paper, Typography, Button } from '@material-ui/core';

import ProgressBarCountdownTimer from './common/ProgressBarCountdownTimer';
import ConnContext from './connection/ConnContext';
import GameContext from './GameContext';

const GuessingAnswerer: React.FC = () => {
  // TODO: show who has guessed already? Might not be necessary though.

  const [selected, setSelected] = useState<string | null>(null);

  const { currentQuestion, currentAnswer, participants, hostCid } = useContext(
    GameContext
  );

  const conn = useContext(ConnContext);

  const handleGuess = () => {
    // guaranteed non null as it only triggers if someone has been selected
    conn.guessAnswerer(selected!);
  };

  const choices = Object.entries(participants)
    .sort((a, b) => (a[0] === hostCid ? -1 : a[0].localeCompare(b[0])))
    .map(([cid, [name, hoot, _]]) => {
      return (
        <Button
          key={cid}
          variant={selected === cid ? 'outlined' : undefined}
          color={selected === cid ? 'primary' : undefined}
          onClick={() => setSelected(cid)}
        >
          {hoot} - {name}
        </Button>
      );
    });

  return (
    <>
      <ProgressBarCountdownTimer countdownSeconds={120} />
      <Paper>
        <Typography color="primary" variant="h5">
          Question
        </Typography>
        <Typography variant="body1">{currentQuestion}</Typography>
        <Typography color="primary" variant="h5">
          Answer
        </Typography>
        <Typography variant="body1">{currentAnswer}</Typography>
      </Paper>
      <Typography variant="h3">Guess hoot dat</Typography>
      {choices}
      <Button
        variant="contained"
        color="primary"
        disabled={selected === null}
        onClick={handleGuess}
      >
        GUESS
      </Button>
    </>
  );
};

export default GuessingAnswerer;
