import React, { useContext } from 'react';
import {
  Typography,
  Button,
  Paper,
  List,
  ListItemText,
  ListItemIcon,
  ListItem,
} from '@material-ui/core';
import { Share, Edit } from '@material-ui/icons';
import { useHistory } from 'react-router-dom';

import ConnContext from './connection/ConnContext';
import GameContext from './GameContext';

// Reachable from:
// Host told server to create room, and server responds with a room id.
// User joined room via roomId, and chose a character already.
// Users have finished a game and pressed play again
const Lobby: React.FC<{
  questions: string[];
  handleAddQuestionButton: () => void;
}> = ({ questions, handleAddQuestionButton }) => {
  const conn = useContext(ConnContext);
  const { cid, hostCid, roomId, participants } = useContext(GameContext);

  const history = useHistory();

  const handleStart = () => {
    conn.startGame(questions);
  };

  const handleQuit = () => {
    conn.leaveRoom();
    history.replace('/');
  };

  //
  const participantCard = (
    <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
      <List dense>
        {Object.entries(participants)
          // sort to ensure everyone sees the same order, host is first.
          .sort((a, b) => (a[0] === hostCid ? -1 : a[0].localeCompare(b[0])))
          .map(([cid, [name, hoot, _]]) => {
            return (
              <ListItem key={cid}>
                <ListItemIcon>{hoot}</ListItemIcon>
                <ListItemText>{name}</ListItemText>
              </ListItem>
            );
          })}
      </List>
    </Paper>
  );

  const questionCard = (
    <>
      <Typography variant="body1">Selected questions</Typography>
      <Button size="small" onClick={handleAddQuestionButton}>
        <Edit />
      </Button>
      <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
        <List dense>
          {questions.map((question, index) => {
            return (
              <ListItem key={index}>
                <ListItemText>
                  Q{index + 1}: {question}
                </ListItemText>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </>
  );

  // need to disable if less than 3 players
  const actionButton =
    cid === hostCid ? (
      questions.length === 0 ? (
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddQuestionButton}
        >
          ADD QUESTIONS
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={handleStart}>
          START GAME
        </Button>
      )
    ) : undefined;

  return (
    <>
      <Typography variant="h3">Room pin: {roomId}</Typography>
      <Share />
      <Typography variant="h3">Hoot assembly ground</Typography>
      <Typography variant="body1">
        Start game when all players are here
      </Typography>
      {participantCard}
      {cid === hostCid && questions.length !== 0 ? questionCard : undefined}
      {actionButton}
      <Button color="primary" onClick={handleQuit}>
        Quit
      </Button>
    </>
  );
};

export default Lobby;
