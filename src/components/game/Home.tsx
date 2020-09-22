import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Typography, Grid } from '@material-ui/core';

import LogInOutButton from '../login/LogInOutButton';
import ConnContext from './connection/ConnContext';
import { Mode } from './GameState';
import useOnlineStatus from '../../utils/useOnlineStatus';
import ActionButton from '../common/ActionButton';
import OuterGrid from '../common/OuterGrid';
import CenteredInnerGrid from '../common/CenteredInnerGrid';
import HootAvatar from '../common/HootAvatar';

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
      <OuterGrid>
        <CenteredInnerGrid>
          <Grid item xs={12}>
            <HootAvatar size="large" />
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
        </CenteredInnerGrid>
      </OuterGrid>
    </>
  );
};

export default Home;
