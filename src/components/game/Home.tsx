import React from 'react';
import { Button, Link, Typography } from '@material-ui/core';
import { Link as RouterLink } from 'react-router-dom';

import LogInOutButton from '../login/LogInOutButton';

const Home: React.FC = () => {
  return (
    <>
      <LogInOutButton />
      <Typography variant="h1">Hoot Dat</Typography>
      <Typography variant="body1">Guess who that answer belongs to</Typography>
      <Typography variant="body1">3 - 12 players</Typography>
      <Button variant="contained" color="primary">
        CREATE NEW GAME
      </Button>
      <Button variant="contained" color="secondary">
        JOIN EXISTING GAME
      </Button>
      <Link color="primary" component={RouterLink} to="/packs">
        QUESTION PACKS
      </Link>
    </>
  );
};

export default Home;
