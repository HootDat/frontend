import React, { useState, useContext } from 'react';
import { Paper, Typography, Button, makeStyles, Grid } from '@material-ui/core';

import ProgressBarCountdownTimer from './common/ProgressBarCountdownTimer';
import ConnContext from './connection/ConnContext';
import GameContext from './GameContext';
import HootAvatar from '../common/HootAvatar';
import ActionButton from '../common/ActionButton';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '0 auto',
    maxWidth: '600px',
    position: 'relative',
    height: '100%',
    textAlign: 'center',
  },
  buttonGroup: {
    position: 'absolute',
    width: '100%',
    bottom: '10px',
  },
  button: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  container: {
    display: 'flex',
    flexFlow: 'column',
    paddingTop: '50px',
    height: 'calc(100% - 60px)',
    width: '100%',
  },
  header: {
    position: 'absolute',
    width: '100%',
    top: '30px',
  },
  questionCard: {
    padding: theme.spacing(2),
    textAlign: 'left',
  },
}));

const GuessingAnswerer: React.FC = () => {
  // TODO: show who has guessed already? Might not be necessary though.

  const [selected, setSelected] = useState<string | null>(null);
  const [guessed, setGuessed] = useState(false);

  const classes = useStyles();

  const { state } = useContext(GameContext);
  const { yourRole, currAnswer, qnNum, questions, players, host } = state!;
  const isGuessing = yourRole === 'guesser';
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
          <Grid item key={cId} xs={6}>
            <Button
              variant="outlined"
              color={selected === cId ? 'secondary' : 'primary'}
              disabled={guessed}
              style={{ width: '100%' }}
              onClick={() => setSelected(cId)}
            >
              <HootAvatar number={player.iconNum} size="xsmall" />
              <span style={{ padding: '0 4px' }}> {player.name}</span>
            </Button>
          </Grid>
        );
      });

  const guesserComponents = () => (
    <>
      <Typography variant="h6">Guess hoot dat</Typography>
      <Grid container spacing={1} style={{ paddingTop: '8px', width: '100%' }}>
        {choices()}
      </Grid>
    </>
  );

  const answererComponents = () => (
    <>
      <HootAvatar size="normal" />
      <Typography variant="h6">Waiting for everyone to guess...</Typography>
    </>
  );

  return (
    <div className={classes.root}>
      <ProgressBarCountdownTimer
        countdownSeconds={120}
        className={classes.header}
      />
      <div className={classes.container}>
        <Paper className={classes.questionCard}>
          <Typography color="primary" variant="body2">
            Question
          </Typography>
          <Typography variant="body1">{questions[qnNum]}</Typography>
          <Typography color="primary" variant="body2">
            Answer
          </Typography>
          <Typography variant="body1">{currAnswer}</Typography>
        </Paper>
        <div style={{ height: '100%', overflow: 'auto' }}>
          {isGuessing ? guesserComponents() : answererComponents()}
        </div>
      </div>
      {isGuessing && (
        <div className={classes.buttonGroup}>
          <ActionButton
            variant="contained"
            color="primary"
            disabled={selected === null || guessed}
            onClick={handleGuess}
            className={classes.button}
          >
            {guessed ? 'Waiting for others' : 'Guess hoot dat'}
          </ActionButton>
        </div>
      )}
    </div>
  );
};

export default GuessingAnswerer;
