import React, { useContext } from 'react';
import { Button, Typography, makeStyles, Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Facebook } from '@material-ui/icons';
import AuthContext from './AuthContext';
import store from '../../utils/store';
import ActionButton from '../common/ActionButton';
import hoot from '../../svg/hoot0.svg';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    padding: theme.spacing(2),
  },
  container: {
    textAlign: 'center',
    maxWidth: '600px',
  },
  hoot: {
    height: '100px',
    width: '100px',
  },
}));
const Login: React.FC = () => {
  const authState = useContext(AuthContext);
  const history = useHistory();
  const classes = useStyles();

  const loggedInCallback = (response: fb.StatusResponse) => {
    if (response.status === 'connected') {
      // TODO forward authResponse.accessToken to server (server gets userId from fb)
      // send api request to server to get access token
      store.setAccessToken('access_token');
      authState.setAuthState({ ...authState, access_token: 'access_token' });
      // TODO notificiaton
      history.replace('/');
    }
    // otherwise do nothing, as it means not logged in
  };

  const handleFacebookLogin = () => {
    if (typeof FB !== 'undefined') {
      FB.login(loggedInCallback);
    } else {
      // TODO fix
      console.log('FB not available. Turn off ad block / tracking protection');
    }
  };

  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      className={classes.root}
    >
      <Grid item container xs={12} spacing={2} className={classes.container}>
        <Grid item xs={12}>
          <img src={hoot} className={classes.hoot} alt="hootdat mascot" />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4">Hoot Dat Community</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Log in to contribute to the question pool
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <ActionButton
            variant="contained"
            color="primary"
            onClick={handleFacebookLogin}
          >
            <Facebook />
            Log in with Facebook
          </ActionButton>
        </Grid>
        <Grid item xs={12}>
          <Button color="primary" onClick={() => history.push('/')}>
            BACK
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Login;
