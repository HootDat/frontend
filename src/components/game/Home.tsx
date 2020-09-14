import React, { useContext } from 'react';
import { Button, Link, Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import LogInOutButton from '../login/LogInOutButton';
import GameContext from './GameContext';
import { Mode } from './GameState';

const Home: React.FC = () => {
  const context = useContext(GameContext);

  const handleCreateButton = () => {
    context.updateMode(Mode.CREATE_ROOM);
  };
  const handleJoinButton = () => {
    context.updateMode(Mode.JOIN_ROOM);
  };

  return (
    <>
      <LogInOutButton />
      <Typography variant="h1">Hoot Dat</Typography>
      <Typography variant="body1">Guess who that answer belongs to</Typography>
      <Typography variant="body1">3 - 12 players</Typography>
      <Button variant="contained" color="primary" onClick={handleCreateButton}>
        CREATE NEW GAME
      </Button>
      <Button variant="contained" color="secondary" onClick={handleJoinButton}>
        JOIN EXISTING GAME
      </Button>
      <Link color="primary" component={RouterLink} to="/packs">
        QUESTION PACKS
      </Link>
    </>
  );
};

export default Home;
