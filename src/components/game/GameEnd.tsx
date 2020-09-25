import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Typography, Button, makeStyles, Grid } from '@material-ui/core';

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

const GameEnd: React.FC = () => {
  const { cId, state } = useContext(GameContext);
  const [isLoading, setIsLoading] = useState(false);

  const { host, results: fullResults, qnNum, players } = state!;
  const results = fullResults[qnNum];

  const conn = useContext(ConnContext);
  const classes = useStyles();

  const history = useHistory();

  const handlePlayAgain = () => {
    conn.backToLobby();
    setIsLoading(true);
  };

  const handleQuit = () => {
    conn.leaveRoom();
    history.push('/');
  };

  // TODO FACEBOOK SHARE?
  return (
    <div className={classes.root}>
      <Grid container spacing={2} style={{ paddingTop: '30px' }}>
        <Grid item xs={12}>
          <Typography variant="h4">Final Scoreboard</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{"Who's the best hoot?"}</Typography>
        </Grid>
        <Grid item xs={12}>
          <ScoreBoard winning results={results} players={players} />
        </Grid>
      </Grid>
      <div className={classes.buttonGroup}>
        {cId === host && (
          <ActionButton
            variant="contained"
            color="primary"
            onClick={handlePlayAgain}
            disabled={isLoading}
            className={classes.button}
          >
            {isLoading ? 'Loading' : 'PLAY AGAIN'}
          </ActionButton>
        )}
        <Button color="primary" onClick={handleQuit} className={classes.button}>
          QUIT
        </Button>
      </div>
    </div>
  );
};

export default GameEnd;
