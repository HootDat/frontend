import React, { useState, useContext } from 'react';
import { Paper, Typography, Button } from '@material-ui/core';

import ProgressBarCountdownTimer from './common/ProgressBarCountdownTimer';
import ConnContext from './connection/ConnContext';
import GameContext from './GameContext';
import HootAvatar from '../common/HootAvatar';
import { getCurrentAnswerer } from './GameState';

const GuessingAnswerer: React.FC = () => {
  // TODO: show who has guessed already? Might not be necessary though.

  const [selected, setSelected] = useState<string | null>(null);

  const { state } = useContext(GameContext);
  const { qnNum, questions, players, host } = state!;

  const conn = useContext(ConnContext);

  const handleGuess = () => {
    // guaranteed non null as it only triggers if someone has been selected
    conn.guessAnswerer(selected!);
  };

  const choices = Object.entries(players)
    .sort((a, b) => (a[0] === host ? -1 : a[0].localeCompare(b[0])))
    .map(([cid, player]) => {
      return (
        <Button
          key={cid}
          variant={selected === cid ? 'outlined' : undefined}
          color={selected === cid ? 'primary' : undefined}
          onClick={() => setSelected(cid)}
        >
          <HootAvatar number={player.iconNum} size="xsmall" /> {player.name}
        </Button>
      );
    });

  const { answer } = getCurrentAnswerer(state!)!;
  // TODO answerer should not guess
  return (
    <>
      <ProgressBarCountdownTimer countdownSeconds={120} />
      <Paper>
        <Typography color="primary" variant="body2">
          Question
        </Typography>
        <Typography variant="body1">{questions[qnNum]}</Typography>
        <Typography color="primary" variant="body2">
          Answer
        </Typography>
        <Typography variant="body1">{answer}</Typography>
      </Paper>
      <Typography variant="h6">Guess hoot dat</Typography>
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
