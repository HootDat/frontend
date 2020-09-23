import React, { useContext, useState } from 'react';
import { Typography, Paper, TextField, Button, Grid} from '@material-ui/core';

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

  const { currentQuestion } = useContext(GameContext);
  const conn = useContext(ConnContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(e.target.value);
  };

  const handleAnswer = () => {
    if (answer.trim() === '') {
      return;
    }

    conn.sendAnswer(answer);
  };

  return (
    <>
      <OuterGrid>
        <CenteredInnerGrid>
          <ProgressBarCountdownTimer countdownSeconds={60} />
          <Grid item xs={12}>
            <Typography variant="h4">What is your answer?</Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={6}>
              <Typography variant="body1">{currentQuestion}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={1} style={{ display: 'inline-block' }}>
              <TextField
                error={answer.trim() === ''}
                helperText={
                  answer.trim() === '' ? 'Answer cannot be blank!' : undefined
                }
                placeholder="Your answer"
                value={answer}
                onChange={handleChange}
              />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <ActionButton variant="contained" color="primary" onClick={handleAnswer}>
              SUBMIT
            </ActionButton>
          </Grid>
        </CenteredInnerGrid>
      </OuterGrid>
    </>
  );
};

export default AnsweringQuestion;
