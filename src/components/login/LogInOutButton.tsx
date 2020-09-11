import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@material-ui/core';

// TODO: Change the button depending on auth state
// TODO: Allow for updating of auth state
// TODO: Add dialog for logout confirmation (Should the login page just be a modal too)
const LogInOutButton: React.FC = () => {
  const LogInButton = (
    <Link color="primary" component={RouterLink} to="/login">
      LOG IN
    </Link>
  );

  const LogOutButton = (
    <Link color="primary" component={RouterLink} to="/">
      LOG OUT
    </Link>
  );

  return true ? LogInButton : LogOutButton;
};

export default LogInOutButton;
