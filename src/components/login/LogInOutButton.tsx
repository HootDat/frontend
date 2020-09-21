import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Button } from '@material-ui/core';
import AuthContext from './AuthContext';
import store from '../../utils/store';

const LogInOutButton: React.FC = () => {
  const authState = useContext(AuthContext);

  const LogInButton = (
    <Button color="primary" component={RouterLink} to="/login">
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
    <Button color="primary" component={Link} onClick={handleLogOut}>
      LOG OUT
    </Button>
  );

  return authState.access_token === null ? LogInButton : LogOutButton;
};

export default LogInOutButton;
