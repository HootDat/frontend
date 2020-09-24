import React, { useContext, useState } from 'react';
import {
  Typography,
  Button,
  Paper,
  List,
  ListItemText,
  ListItem,
  Grid,
  makeStyles,
  IconButton,
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

import ConnContext from './connection/ConnContext';
import GameContext from './GameContext';
import HootAvatar from '../common/HootAvatar';

import ActionButton from '../common/ActionButton';
import ShareButton from './common/ShareButton';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '0 auto',
    maxWidth: '600px',
    position: 'relative',
    height: '100%',
    textAlign: 'center',
  },
  header: {
    paddingTop: '20px',
  },
  headerText: {
    position: 'relative',
    top: '2px',
  },
  buttonGroup: {
    position: 'absolute',
    width: '100%',
    bottom: '0px',
  },
  button: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  cardListings: {
    height: '120px',
    overflow: 'auto',
  },
  icon: {
    position: 'absolute',
    right: 0,
  },
}));

// Reachable from:
// Host told server to create room, and server responds with a room id.
// User joined room via gameCode, and chose a character already.
// Users have finished a game and pressed play again
const Lobby: React.FC<{
  questions: string[];
  handleAddQuestionButton: () => void;
}> = ({ questions, handleAddQuestionButton }) => {
  const conn = useContext(ConnContext);
  const { cId, state } = useContext(GameContext);
  const { host, gameCode, players } = state!;
  const [started, setStarted] = useState(false);

  const history = useHistory();
  const classes = useStyles();

  const handleStart = () => {
    conn.startGame();
    setStarted(true);
  };

  const handleQuit = () => {
    conn.leaveRoom();
    history.replace('/');
  };

  const playersCard = (
    <Paper className={classes.cardListings}>
      <List dense>
        {Object.entries(players)
          // sort to ensure everyone sees the same order, host is first.
          .sort((a, b) => (a[0] === host ? -1 : a[0].localeCompare(b[0])))
          .map(([cId, player]) => {
            return (
              <ListItem key={cId}>
                <HootAvatar number={player.iconNum} size="xsmall" />
                <ListItemText style={{ marginLeft: '8px' }}>
                  <Typography variant="body1">{player.name}</Typography>
                </ListItemText>
              </ListItem>
            );
          })}
      </List>
    </Paper>
  );

  const questionCard = (
    <>
      <Typography variant="h6">
        Selected questions
        <IconButton
          size="small"
          onClick={handleAddQuestionButton}
          className={classes.icon}
        >
          <Edit />
        </IconButton>
      </Typography>
      <Paper className={classes.cardListings}>
        <List dense>
          {questions.map((question, index) => {
            return (
              <ListItem key={index}>
                <ListItemText>
                  <Typography variant="body2">
                    Q{index + 1}: {question}
                  </Typography>
                </ListItemText>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </>
  );

  const actionButton =
    cId === host ? (
      questions.length === 0 ? (
        <ActionButton
          variant="contained"
          color="primary"
          onClick={handleAddQuestionButton}
          className={classes.button}
        >
          ADD QUESTIONS
        </ActionButton>
      ) : (
        <ActionButton
          variant="contained"
          color="primary"
          disabled={false /*Object.keys(players).length < 3 || started */}
          onClick={handleStart}
          className={classes.button}
        >
          {started ? 'loading' : 'start game'}
        </ActionButton>
      )
    ) : undefined;

  return (
    <div className={classes.root}>
      <Typography className={classes.header} color="secondary" variant="h4">
        <span className={classes.headerText}>Room pin: {gameCode}</span>
        <ShareButton gameCode={gameCode} />
      </Typography>
      <Grid container alignItems="center" justify="center" spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4">Hoot assembly ground</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            {cId === host
              ? 'Start game when all players are here'
              : 'Waiting for host to start the game'}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {playersCard}
        </Grid>
        <Grid item xs={12}>
          {cId === host && questions.length !== 0 ? questionCard : undefined}
        </Grid>
      </Grid>
      <div className={classes.buttonGroup}>
        {actionButton}
        <Button color="primary" onClick={handleQuit} className={classes.button}>
          Quit
        </Button>
      </div>
    </div>
  );
};

export default Lobby;
