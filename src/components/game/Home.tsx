import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography, Grid, makeStyles } from '@material-ui/core';

import LogInOutButton from '../login/LogInOutButton';
import ConnContext from './connection/ConnContext';
import { Mode } from './GameState';
import useOnlineStatus from '../../utils/useOnlineStatus';
import ActionButton from '../common/ActionButton';
import hoot from '../../svg/hoot0.svg';

const useStyles = makeStyles(theme => ({
  rootContainer: {
    height: '100%',
    padding: theme.spacing(2),
  },
  header: {
    textAlign: 'right',
    width: '100%',
  },
  mainContainer: {
    textAlign: 'center',
    height: 'calc(100% - 36.5px)',
    maxWidth: '600px',
  },
  hoot: {
    width: '100px',
    height: '100px',
  },
}));

const Home: React.FC = () => {
  const conn = useContext(ConnContext);
  const online = useOnlineStatus();

  const classes = useStyles();

  const handleCreateButton = () => {
    conn.updateMode(Mode.CREATE_ROOM);
  };
  const handleJoinButton = () => {
    conn.updateMode(Mode.JOIN_ROOM);
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      className={classes.rootContainer}
    >
      <Grid item className={classes.header}>
        <LogInOutButton />
      </Grid>
      <Grid
        item
        container
        alignItems="center"
        justify="center"
        className={classes.mainContainer}
      >
        <Grid item container xs={12} spacing={2}>
          <Grid item xs={12}>
            <img src={hoot} className={classes.hoot} alt="hootdat mascot" />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h3">Hoot Dat</Typography>
            <Typography variant="body1">
              Guess who that answer belongs to
            </Typography>
            <Typography variant="body2">3 - 12 players</Typography>
          </Grid>
          <Grid item xs={12}>
            <ActionButton
              variant="contained"
              color="primary"
              disabled={!online}
              onClick={handleCreateButton}
            >
              CREATE NEW GAME
            </ActionButton>
          </Grid>
          <Grid item xs={12}>
            <ActionButton
              variant="contained"
              color="secondary"
              disabled={!online}
              onClick={handleJoinButton}
            >
              JOIN EXISTING GAME
            </ActionButton>
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" component={RouterLink} to="/packs">
              QUESTION PACKS
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Home;
