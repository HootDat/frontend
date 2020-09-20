import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Link, Typography, makeStyles } from '@material-ui/core';

import LogInOutButton from '../login/LogInOutButton';
import ConnContext from './connection/ConnContext';
import { Mode } from './GameState';
import useOnlineStatus from '../../utils/useOnlineStatus';

const Home: React.FC = () => {
  const conn = useContext(ConnContext);
  const online = useOnlineStatus();

  const handleCreateButton = () => {
    conn.updateMode(Mode.CREATE_ROOM);
  };
  const handleJoinButton = () => {
    conn.updateMode(Mode.JOIN_ROOM);
  };

  return (
    <>
      <LogInOutButton />
      <Typography variant="h3">Hoot Dat</Typography>
      <Typography variant="body1">Guess who that answer belongs to</Typography>
      <Typography variant="body2">3 - 12 players</Typography>
      <Button
        variant="contained"
        color="primary"
        disabled={!online}
        onClick={handleCreateButton}
      >
        CREATE NEW GAME
      </Button>
      <Button
        variant="contained"
        color="secondary"
        disabled={!online}
        onClick={handleJoinButton}
      >
        JOIN EXISTING GAME
      </Button>
      <Link color="primary" component={RouterLink} to="/packs">
        QUESTION PACKS
      </Link>
    </>
  );
};

export default Home;
