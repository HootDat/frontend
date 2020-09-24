import React, { useContext, useState } from 'react';
import { Typography, Paper, TextField, Grid } from '@material-ui/core';

import ProgressBarCountdownTimer from './common/ProgressBarCountdownTimer';
import ConnContext from './connection/ConnContext';
import GameContext from './GameContext';

import OuterGrid from '../common/OuterGrid';
import CenteredInnerGrid from '../common/CenteredInnerGrid';
import ActionButton from '../common/ActionButton';
// TODO: Do we need a timer here? Kinda makes sense, but if they don't
// answer then that's another state we need to account for :/
const AnsweringQuestion: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [answered, setAnswered] = useState(false);

  const { state } = useContext(GameContext);

  const { questions, qnNum } = state!;

  const conn = useContext(ConnContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const handleAnswer = () => {
    setAnswered(true);
    conn.sendAnswer(answer);
  };

  return (
    <OuterGrid>
      <CenteredInnerGrid>
        <Grid item xs={12}>
          <ProgressBarCountdownTimer countdownSeconds={60} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4">What is your answer?</Typography>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={6}>
            <Typography variant="body1">{questions[qnNum]}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={1} style={{ display: 'inline-block' }}>
            <TextField
              placeholder="Your answer"
              value={answer}
              disabled={answered}
              onChange={handleChange}
            />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <ActionButton
            variant="contained"
            color="primary"
            disabled={answer.trim() === '' || answered}
            onClick={handleAnswer}
          >
            {answered ? 'Loading' : 'Answer'}
          </ActionButton>
        </Grid>
      </CenteredInnerGrid>
    </OuterGrid>
  );
};

export default AnsweringQuestion;
