import { IconButton, Snackbar, SnackbarProps } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import store from '../utils/store';
import useOnlineStatus from '../utils/useOnlineStatus';
import PushNotification, {
  Notification,
} from './common/notification/PushNotification';
import AuthContext from './login/AuthContext';
import AuthState from './login/AuthState';

// Sets up notifications and auth context
const AppShell: React.FC = ({ children }) => {
  // getAccessToken will verify and return a proper token if it exists.
  // TODO fill in name
  const [authState, setAuthState] = useState<AuthState>({
    user: store.getCurrentUser(),
    setAuthState: () => {},
  });
  const [notification, setNotification] = useState<Notification>({
    message: '',
  });
  const [open, setOpen] = useState(false);
  const online = useOnlineStatus();

  useEffect(() => {
    setAuthState({
      ...authState,
      setAuthState: setAuthState,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (online) return;

    setNotification({ message: 'You are currently offline', severity: 'info' });
  }, [online]);

  useEffect(() => {
    if (notification.message === '') return;

    setOpen(true);
  }, [notification]);

  const handleClose = () => setOpen(false);

  const snackbarProps: SnackbarProps = {
    anchorOrigin: { vertical: 'top', horizontal: 'center' },
    autoHideDuration: 6000,
    open: open,
    onClose: handleClose,
    action: (
      <IconButton size="small" onClick={handleClose}>
        <Close fontSize="small" />
      </IconButton>
    ),
  };

  const whichSnackbar = () =>
    notification.severity ? (
      <Snackbar {...snackbarProps}>
        <Alert
          onClose={handleClose}
          elevation={6}
          variant="filled"
          severity={notification.severity}
          style={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    ) : (
      <Snackbar {...snackbarProps} message={notification.message} />
    );

  return (
    <PushNotification.Provider value={setNotification}>
      <AuthContext.Provider value={authState}>
        {whichSnackbar()}
        {children}
      </AuthContext.Provider>
    </PushNotification.Provider>
  );
};

export default AppShell;
