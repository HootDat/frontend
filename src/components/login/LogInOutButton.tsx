import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Button, makeStyles } from '@material-ui/core';
import AuthContext from './AuthContext';
import store from '../../utils/store';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'absolute',
    right: theme.spacing(2),
  },
}));

const LogInOutButton: React.FC = () => {
  const authState = useContext(AuthContext);

  const classes = useStyles();

  const LogInButton = (
    <Button
      color="primary"
      component={RouterLink}
      to="/login"
      className={classes.root}
    >
      LOG IN
    </Button>
  );

  // TODO: Add dialog for logout confirmation (Should the login page just be a modal too)
  const handleLogOut = () => {
    // TODO: tell server log out
    store.removeAccessToken();
    authState.setAuthState({ ...authState, access_token: null });
  };

  const LogOutButton = (
    <Button color="primary" onClick={handleLogOut} className={classes.root}>
      LOG OUT
    </Button>
  );

  return authState.access_token === null ? LogInButton : LogOutButton;
};

export default LogInOutButton;
