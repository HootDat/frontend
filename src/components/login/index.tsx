import React from 'react';
import { Button, Link, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';

// TODO: If logged in, go back to '/' with a notification telling user they
// are logged in
// TODO: Setup facebook login
const Login: React.FC = () => {
  const history = useHistory();

  return (
    <>
      <Typography variant="h1">Hoot Dat Community</Typography>
      <Typography variant="body1">
        Login to contribute to the question pool
      </Typography>
      <Button variant="contained" color="primary">
        Facebook Login
      </Button>
      <Link color="primary" component="button" onClick={history.goBack}>
        BACK
      </Link>
    </>
  );
};

export default Login;
