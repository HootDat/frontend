import React, { useContext } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Facebook } from '@material-ui/icons';
import AuthContext from './AuthContext';
import store from '../../utils/store';
import ActionButton from '../common/ActionButton';
import BackButton from '../common/BackButton';
import CenteredInnerGrid from '../common/CenteredInnerGrid';
import OuterGrid from '../common/OuterGrid';
import PaddedDiv from '../common/PaddedDiv';
import HootAvatar from '../common/HootAvatar';
import authAPI from '../../api/auth';
import packsAPI from '../../api/packs';

const Login: React.FC = () => {
  const authState = useContext(AuthContext);
  const history = useHistory();

  const loggedInCallback = (response: fb.StatusResponse) => {
    if (response.status === 'connected') {
      // send api request to server to get access token
      try {
        authAPI
          .postLogin(response.authResponse.accessToken)
          .then(async user => {
            authState.setAuthState({ ...authState, user: user });
            store.setCurrentUser(user);

            // remove packs with different owner id
            // fetch my packs and merge
            // appshell will send the remaining requests for new packs
            const myPacks = await packsAPI.getPacks(
              undefined,
              undefined,
              'own'
            );

            // store will choose whether to use server or local copy
            myPacks.forEach(pack => store.downloadPack(pack));

            history.push('/');
          });
        // TODO notificiaton to inform user that we are syncing
      } catch (err) {
        switch (err.code) {
          // TODO notify user that auth failed
          case 400:
          case 401:
          case 403:
          default:
        }
      }
    }
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
            <HootAvatar size="large" />
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
