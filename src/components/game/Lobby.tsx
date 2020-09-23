import React, { useContext } from 'react';
import {
  Typography,
  Button,
  Paper,
  List,
  ListItemText,
  ListItemIcon,
  ListItem,
  Grid,
} from '@material-ui/core';
import { Share, Edit } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

import ConnContext from './connection/ConnContext';
import GameContext from './GameContext';
import HootAvatar from '../common/HootAvatar';

import ActionButton from '../common/ActionButton';
import OuterGrid from '../common/OuterGrid';
import CenteredInnerGrid from '../common/CenteredInnerGrid';

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

  const history = useHistory();

  const handleStart = () => {
    conn.startGame(questions);
  };

  const handleQuit = () => {
    conn.leaveRoom();
    history.replace('/');
  };

  const participantCard = (
    <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
      <List dense>
        {Object.entries(players)
          // sort to ensure everyone sees the same order, host is first.
          .sort((a, b) => (a[0] === host ? -1 : a[0].localeCompare(b[0])))
          .map(([cId, player]) => {
            return (
              <ListItem key={cId}>
                <ListItemIcon>
                  <HootAvatar number={player.iconNum} size="xsmall" />
                </ListItemIcon>
                <ListItemText>
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
      <Typography variant="h6">Selected questions</Typography>
      <Button size="small" onClick={handleAddQuestionButton}>
        <Edit />
      </Button>
      <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
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
        >
          ADD QUESTIONS
        </ActionButton>
      ) : (
        <ActionButton
          variant="contained"
          color="primary"
          disabled={Object.keys(players).length < 3}
          onClick={handleStart}
        >
          START GAME
        </ActionButton>
      )
    ) : undefined;

  return (
    <OuterGrid>
      <CenteredInnerGrid>
        <Grid item xs={12}>
          <Typography color="secondary" variant="h4">
            Room pin: {gameCode}
            <Share />
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4">Hoot assembly ground</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">
            Start game when all players are here
          </Typography>
        </Grid>
        <Grid item xs={12}>
          {participantCard}
        </Grid>
        <Grid item xs={12}>
          {cId === host && questions.length !== 0 ? questionCard : undefined}
        </Grid>
        <Grid item xs={12}>
          {actionButton}
        </Grid>
        <Grid item xs={12}>
          <Button color="primary" onClick={handleQuit}>
            Quit
          </Button>
        </Grid>
      </CenteredInnerGrid>
    </OuterGrid>
  );
};

export default Lobby;
