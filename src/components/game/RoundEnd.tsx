import React, { useContext, useState } from 'react';
import { Typography, makeStyles, Grid } from '@material-ui/core';

import ScoreBoard from './common/ScoreBoard';
import ConnContext from './connection/ConnContext';
import GameContext from './GameContext';
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
}));

const RoundEnd: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  // participants should be updated with the updated scores already
  const { cId, state } = useContext(GameContext);
  const classes = useStyles();

  const { curAnswerer, host, players, qnNum, results: fullResults } = state!;
  const results = fullResults[qnNum];
  const isLastRound = results.length - 1 === qnNum;
  const isAnswerer = curAnswerer === cId;

  const conn = useContext(ConnContext);

  const handleNextQuestion = () => {
    setIsReady(true);
    // TODO probably can remove, since there will be auto advance by the server
    conn.readyForNextRound();
  };

  const myResult = results.find(result => result.cId === cId)!;

  const header = () => {
    if (isAnswerer) {
      const numRight = results.filter(
        result => result.role === 'guesser' && result.answer === cId
      ).length;

      if (numRight === 0) {
        return <Typography variant="h6">No one guessed it right :(</Typography>;
      }
      return (
        <Typography variant="h6">
          {numRight} people guessed it right!
        </Typography>
      );
    }

    return (
      <Typography variant="h6">
        You got it
        {myResult?.answer === curAnswerer! ? ' right :)' : ' wrong :('}
      </Typography>
    );
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={2} style={{ paddingTop: '30px' }}>
        <Grid item xs={12}>
          {header()}
        </Grid>
        <Grid item xs={12}>
          <ScoreBoard host={host!} header results={results} players={players} />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Who answered? </Typography>
        </Grid>
        <Grid item xs={12}>
          <ScoreBoard players={players} results={[myResult]} />
        </Grid>
      </Grid>
      <div className={classes.buttonGroup}>
        <ActionButton
          variant="contained"
          color="primary"
          disabled={isReady}
          onClick={handleNextQuestion}
          className={classes.button}
        >
          {isReady
            ? 'WAITING FOR OTHERS'
            : isLastRound
            ? 'SUMMARY'
            : 'NEXT QUESTION'}
        </ActionButton>
      </div>
    </div>
  );
};

export default RoundEnd;
