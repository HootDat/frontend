import React, { useState } from 'react';
import { ChatBubbleOutline, Close, Send } from '@material-ui/icons';
import {
  makeStyles,
  Backdrop,
  IconButton,
  Button,
  InputBase,
  Paper,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    width: '100%',
    height: '100%',
  },
  toggleIcon: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
  },
  hidden: {
    visibility: 'hidden',
  },
  messageBox: {
    position: 'absolute',
    width: '100%',
    borderRadius: 0,
    bottom: 0,
  },
}));

const ChatShell: React.FC = ({ children }) => {
  const [open, setIsOpen] = useState(false);
  const classes = useStyles();

  // TODO send & receive messages
  // render message cards

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={`${classes.toggleIcon} ${open ? classes.hidden : ''}`}
      >
        Chat <ChatBubbleOutline />
      </Button>
      <Backdrop open={open} className={classes.backdrop}>
        <Button onClick={() => setIsOpen(false)} className={classes.toggleIcon}>
          Back <Close />
        </Button>
        <Paper className={classes.messageBox}>
          <InputBase
            placeholder="Message"
            inputProps={{ 'aria-label': 'Send Message' }}
          />
          <IconButton aria-label="Send">
            <Send />
          </IconButton>
        </Paper>
      </Backdrop>
      {children}
    </>
  );
};

export default ChatShell;
