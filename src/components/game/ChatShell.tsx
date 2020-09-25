import React, { useState, useContext, useEffect } from 'react';
import { ChatBubbleOutline, Close, Send } from '@material-ui/icons';
import {
  makeStyles,
  Backdrop,
  IconButton,
  Button,
  InputBase,
  Paper,
  Badge,
  Grid,
  Typography,
} from '@material-ui/core';
import ConnContext from './connection/ConnContext';
import GameContext from './GameContext';
import { ChatMessage } from './common/ChatMessage';
import HootAvatar from '../common/HootAvatar';

const useStyles = makeStyles(theme => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
    width: '100%',
    height: '100%',
  },
  toggleIcon: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    zIndex: theme.zIndex.drawer + 1,
  },
  hidden: {
    visibility: 'hidden',
  },
  messageBox: {
    position: 'absolute',
    width: '100vw',
    borderRadius: 0,
    bottom: 0,
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: '10px',
  },
  icon: {
    paddingLeft: theme.spacing(1),
  },
  myMessage: {
    textAlign: 'right',
    maxWidth: '90%',
    padding: '4px 8px',
    borderRadius: 20,
    wordWrap: 'break-word',
    backgroundColor: '#f2f2f2',
    color: '#304b6d',
  },
  otherMessage: {
    maxWidth: '70%',
    padding: '4px 8px',
    borderRadius: 20,
    wordWrap: 'break-word',
    backgroundColor: '#fef5ed',
    color: '#304b6d',
  },
  chatArea: {
    overflow: 'auto',
    height: 'calc(100% - 110px)',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  otherPlayer: {
    backgroundColor: '#f8d3d3',
    borderRadius: '50%',
    display: 'inline-block',
    height: '30px',
    width: '30px',
    padding: '5px',
  },
}));

const ChatShell: React.FC = ({ children }) => {
  const [open, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const classes = useStyles();
  const conn = useContext(ConnContext);
  const { cId, state } = useContext(GameContext);
  const { players } = state!;
  const [messages, setMessages] = useState([] as ChatMessage[]);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    conn.setChatHandler(setMessages);

    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!open) return;

    setUnread(0);
  }, [open]);

  useEffect(() => {
    if (open || messages.length === 0) return;

    setUnread(unread + 1);
    // eslint-disable-next-line
  }, [messages]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (message.trim() === '') return;
    conn.sendMessage(message);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend();
  };

  // TODO send & receive messages
  // render message cards

  const renderMessages = () => {
    return messages.map((message, index) => {
      // ignore messages from players who have left already
      if (players[message.cId] === undefined) return <></>;

      if (cId === message.cId) {
        return (
          <Grid item container justify="flex-end" xs={12} key={index}>
            <div className={classes.myMessage}>
              <Typography variant="body1">{message.message}</Typography>
            </div>
          </Grid>
        );
      } else {
        return (
          <Grid
            item
            container
            alignItems="center"
            justify="flex-start"
            xs={12}
            key={index}
          >
            <Grid item className={classes.otherPlayer}>
              <HootAvatar number={players[message.cId].iconNum} size="xsmall" />
            </Grid>
            <Grid item style={{ padding: '0 8px' }}>
              <Typography variant="body1" style={{ color: '#FFF' }}>
                {players[message.cId].name}
              </Typography>
            </Grid>
            <Grid item className={classes.otherMessage}>
              <Typography variant="body1">{message.message}</Typography>
            </Grid>
          </Grid>
        );
      }
    });
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className={`${classes.toggleIcon} ${open ? classes.hidden : ''}`}
      >
        Chat{' '}
        <Badge
          color="primary"
          className={classes.icon}
          badgeContent={unread}
          max={99}
        >
          <ChatBubbleOutline />{' '}
        </Badge>
      </Button>
      <Backdrop open={open} className={classes.backdrop}>
        <Button
          onClick={() => setIsOpen(false)}
          className={classes.toggleIcon}
          style={{ backgroundColor: '#fff' }}
        >
          Close <Close />
        </Button>
        <Grid
          container
          direction="column"
          alignItems="flex-start"
          className={classes.chatArea}
        >
          <Grid item container spacing={1}>
            {renderMessages()}
          </Grid>
        </Grid>
        <Paper className={classes.messageBox}>
          <InputBase
            placeholder="Message"
            className={classes.input}
            inputProps={{ 'aria-label': 'Send Message' }}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            value={message}
          />
          <IconButton
            aria-label="Send"
            className={classes.iconButton}
            onClick={handleSend}
          >
            <Send />
          </IconButton>
        </Paper>
      </Backdrop>
      {children}
    </>
  );
};

export default ChatShell;
