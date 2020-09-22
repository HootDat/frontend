import React, { useContext } from 'react';
import { Typography, makeStyles, Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Facebook } from '@material-ui/icons';
import AuthContext from './AuthContext';
import store from '../../utils/store';
import ActionButton from '../common/ActionButton';
import hoot from '../../svg/hootimages/bluehoot.svg';
import BackButton from '../common/BackButton';
import CenteredInnerGrid from '../common/CenteredInnerGrid';
import OuterGrid from '../common/OuterGrid';
import PaddedDiv from '../common/PaddedDiv';

const useStyles = makeStyles(theme => ({
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
      // remove packs with different owner id
      // fetch my packs and merge
      // appshell will send the remaining requests for new packs
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
    <PaddedDiv>
      <OuterGrid>
        <CenteredInnerGrid>
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
            <BackButton handleBack={() => history.push('/')} />
          </Grid>
        </CenteredInnerGrid>
      </OuterGrid>
    </PaddedDiv>
  );
};

export default Login;
