import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@material-ui/core';
import AuthContext from './AuthContext';
import localStorage from '../../utils/localStorage';

const LogInOutButton: React.FC = () => {
  const authState = useContext(AuthContext);

  const LogInButton = (
    <Link color="primary" component={RouterLink} to="/login">
      LOG IN
    </Link>
  );

  // TODO: Add dialog for logout confirmation (Should the login page just be a modal too)
  const handleLogOut = () => {
    // TODO: tell server log out
    localStorage.removeAccessToken();
    authState.setAuthState({ ...authState, access_token: null });
  };

  const LogOutButton = (
    <Link color="primary" onClick={handleLogOut}>
      LOG OUT
    </Link>
  );

  return authState.access_token === null ? LogInButton : LogOutButton;
};

export default LogInOutButton;
