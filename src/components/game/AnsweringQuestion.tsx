import React, { useContext, useState } from 'react';
import {
  Typography,
  Paper,
  TextField,
  Grid,
  makeStyles,
} from '@material-ui/core';

import ConnContext from './connection/ConnContext';
import GameContext from './GameContext';

import OuterGrid from '../common/OuterGrid';
import CenteredInnerGrid from '../common/CenteredInnerGrid';
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
  question: {
    height: '150px',
    overflow: 'auto',
    padding: theme.spacing(2),
  },
  header: {
    position: 'absolute',
    width: '100%',
    top: '24px',
  },
}));

const AnsweringQuestion: React.FC = () => {
  const [answer, setAnswer] = useState('');
  const [answered, setAnswered] = useState(false);

  const classes = useStyles();

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (answer.trim() === '' || answered) return;

    if (e.key === 'Enter') {
      handleAnswer();
    }
  };

  return (
    <div className={classes.root}>
      <OuterGrid>
        <CenteredInnerGrid>
          <Grid item xs={12}>
            <Typography variant="h4">What is your answer?</Typography>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={1} className={classes.question}>
              <Typography variant="body1" align="left">
                {questions[qnNum]}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <TextField
              placeholder="Your answer"
              variant="outlined"
              value={answer}
              fullWidth
              disabled={answered}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
            />
          </Grid>
        </CenteredInnerGrid>
      </OuterGrid>
      <div className={classes.buttonGroup}>
        <ActionButton
          variant="contained"
          color="primary"
          disabled={answer.trim() === '' || answered}
          onClick={handleAnswer}
          className={classes.button}
        >
          {answered ? 'Loading' : 'Send Answer'}
        </ActionButton>
      </div>
    </div>
  );
};

export default AnsweringQuestion;
