import { Grid, Typography } from '@material-ui/core';
import { Facebook } from '@material-ui/icons';
import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import authAPI from '../../api/auth';
import packsAPI from '../../api/packs';
import { ApiErrorResponse } from '../../types/api';
import { User } from '../../types/user';
import store from '../../utils/store';
import ActionButton from '../common/ActionButton';
import BackButton from '../common/BackButton';
import CenteredInnerGrid from '../common/CenteredInnerGrid';
import HootAvatar from '../common/HootAvatar';
import PushNotification from '../common/notification/PushNotification';
import OuterGrid from '../common/OuterGrid';
import PaddedDiv from '../common/PaddedDiv';
import AuthContext from './AuthContext';

const Login: React.FC = () => {
  const authState = useContext(AuthContext);
  const history = useHistory();
  const pushNotif = useContext(PushNotification);

  const loggedInCallback = (response: fb.StatusResponse) => {
    if (response.status !== 'connected') {
      pushNotif({
        message: 'Facebook authentication failed, please try again',
        severity: 'warning',
      });
      return;
    }

    // send api request to server to get access token
    authAPI
      .postLogin(response.authResponse.accessToken)
      .then(async user => {
        authState.setAuthState({ ...authState, user: user });
        store.setCurrentUser(user);
        // Managed to log in, start to sync own packs with server
        await syncOwnPacks(user);
      })
      .catch((err: ApiErrorResponse) => {
        // No body: request timed out
        if (!err.body) {
          pushNotif({
            message: 'Server is currently unreachable, please try again later',
            severity: 'warning',
          });
          return;
        }
        // received server response but is not 2xx
        pushNotif({
          message: `Login failed: ${err.body.error}`,
          severity: 'error',
        });
        return;
      });
  };

  const syncOwnPacks = async (user: User) => {
    pushNotif({
      message: 'Syncing local changes to the server',
      severity: 'info',
    });
    try {
      // remove packs with different owner id
      store.keepPacksForUser(user.id);
      // fetch my packs and merge
      // appshell will send the remaining requests for new packs
      const myPacks = await packsAPI.getPacks(undefined, undefined, 'own');
      // store will choose whether to use server or local copy
      myPacks.forEach(pack => store.downloadPack(pack));
      history.replace('/');
      pushNotif({
        message: 'Local changes successfully synced to the server!',
        severity: 'success',
      });
    } catch (error) {
      pushNotif({
        message: 'Could not sync, will try again later',
        severity: 'warning',
      });
    }
  };

  const handleFacebookLogin = () => {
    if (typeof FB !== 'undefined') {
      FB.login(loggedInCallback);
    } else {
      pushNotif({
        message:
          'Could not reach Facebook. Please turn off ad block / tracking protection',
        severity: 'error',
      });
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
