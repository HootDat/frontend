import React, { useContext, useEffect } from 'react';
import { Button, Link, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Facebook } from '@material-ui/icons';
import AuthContext from './AuthContext';

// TODO: If logged in, go back to '/' with a notification telling user they
// are logged in
// TODO: Setup facebook login
const Login: React.FC = () => {
  const authState = useContext(AuthContext);
  const history = useHistory();

  const loggedInCallback = (response: fb.StatusResponse) => {
    if (response.status === 'connected') {
      // forward authResponse.accessToken to server (server gets userId from fb)
      // send api request to server to get access token
      // alternatively maybe retrieve from store?
      authState.setAuthState({ ...authState, access_token: 'access_token' });
      // TODO notificiaton
      history.replace('/');
    }
    // otherwise do nothing, as it means not logged in
  };

  useEffect(() => {
    FB.getLoginStatus(loggedInCallback);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFacebookLogin = () => {
    FB.login(loggedInCallback);
  };

  return (
    <>
      <Typography variant="h1">Hoot Dat Community</Typography>
      <Typography variant="body1">
        Log in to contribute to the question pool
      </Typography>
      <Button variant="contained" color="primary" onClick={handleFacebookLogin}>
        <Facebook />
        Log in with Facebook
      </Button>
      <Link
        color="primary"
        component="button"
        onClick={() => history.push('/')}
      >
        BACK
      </Link>
    </>
  );
};

export default Login;
