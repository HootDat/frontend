import React, { useState, useContext } from 'react';
import GameContext from './GameContext';
import { Paper, Typography, Button } from '@material-ui/core';
import ConnContext from './connection/ConnContext';

const GuessingAnswerer: React.FC = () => {
  // TODO: Timer. Using setTimeout/setInterval does not seem to work
  // properly. When you change tab, it stops progressing.

  const [selected, setSelected] = useState<string | null>(null);

  const { currentQuestion, currentAnswer, participants, hostCid } = useContext(
    GameContext
  );

  const conn = useContext(ConnContext);

  const handleGuess = () => {
    if (selected === null) return;
    // TODO: should show snackbar that you must select someone first
    conn.guessAnswerer(selected);
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
      <Button variant="contained" color="primary" onClick={handleGuess}>
        GUESS
      </Button>
    </>
  );
};

export default GuessingAnswerer;
