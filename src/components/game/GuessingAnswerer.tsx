import React, { useState, useContext } from 'react';
import { Paper, Typography, Button } from '@material-ui/core';

import ProgressBarCountdownTimer from './common/ProgressBarCountdownTimer';
import ConnContext from './connection/ConnContext';
import GameContext from './GameContext';
import HootAvatar from '../common/HootAvatar';

const GuessingAnswerer: React.FC = () => {
  // TODO: show who has guessed already? Might not be necessary though.

  const [selected, setSelected] = useState<string | null>(null);
  const [guessed, setGuessed] = useState(false);

  const { cId, state } = useContext(GameContext);
  const { curAnswer, curAnswerer, qnNum, questions, players, host } = state!;

  const conn = useContext(ConnContext);

  const handleGuess = () => {
    // guaranteed non null as it only triggers if someone has been selected
    setGuessed(true);
    conn.guessAnswerer(selected!);
  };

  const choices = () =>
    Object.entries(players)
      .sort((a, b) => (a[0] === host ? -1 : a[0].localeCompare(b[0])))
      .map(([cId, player]) => {
        return (
          <Button
            key={cId}
            variant={selected === cId ? 'outlined' : undefined}
            color={selected === cId ? 'primary' : undefined}
            disabled={guessed}
            onClick={() => setSelected(cId)}
          >
            <HootAvatar number={player.iconNum} size="xsmall" /> {player.name}
          </Button>
        );
      });

  const guesserComponents = () => (
    <>
      <Typography variant="h6">Guess hoot dat</Typography>
      {choices()}
      <Button
        variant="contained"
        color="primary"
        disabled={selected === null || guessed}
        onClick={handleGuess}
      >
        {guessed ? 'Guess' : 'Waiting for others'}
      </Button>
    </>
  );

  const answererComponents = () => (
    <>
      <HootAvatar size="normal" />
      <Typography variant="h6">Waiting for everyone to guess...</Typography>
    </>
  );

  const isGuessing = curAnswerer !== cId;

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
        <Typography variant="body1">{curAnswer}</Typography>
      </Paper>
      {isGuessing ? guesserComponents() : answererComponents()}
    </>
  );
};

export default GuessingAnswerer;
