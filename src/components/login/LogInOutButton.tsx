import { Button, makeStyles } from '@material-ui/core';
import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import store from '../../utils/store';
import useOnlineStatus from '../../utils/useOnlineStatus';
import PushNotification from '../common/notification/PushNotification';
import AuthContext from './AuthContext';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    right: theme.spacing(2),
  },
}));

const LogInOutButton: React.FC = () => {
  const authState = useContext(AuthContext);
  const pushNotif = useContext(PushNotification);
  const online = useOnlineStatus();

  const classes = useStyles();

  const LogInButton = (
    <Button
      color="primary"
      component={RouterLink}
      to="/login"
      className={classes.root}
      disabled={!online}
    >
      LOG IN
    </Button>
  );

  const handleLogOut = () => {
    pushNotif({ message: 'You have logged out', severity: 'success' });
    store.removeLoginState();
    store.clearPacks();
    authState.setAuthState({ ...authState, user: null });
  };

  const LogOutButton = (
    <Button color="primary" onClick={handleLogOut} className={classes.root}>
      LOG OUT
    </Button>
  );

  return authState.user === null ? LogInButton : LogOutButton;
};

export default LogInOutButton;
