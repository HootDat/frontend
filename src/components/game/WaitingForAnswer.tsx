import React, { useContext } from 'react';
import {
  Typography,
  Paper,
  List,
  ListSubheader,
  ListItem,
  ListItemText,
} from '@material-ui/core';

import ProgressBarCountdownTimer from './common/ProgressBarCountdownTimer';
import GameContext from './GameContext';

const WaitingForAnswer: React.FC = () => {
  const { participants, hostCid } = useContext(GameContext);

  const scoreBoard = Object.entries(participants)
    .sort((a, b) => (a[0] === hostCid ? -1 : a[0].localeCompare(b[0])))
    .map(([cid, [name, hoot, score]]) => {
      return (
        <ListItem key={cid}>
          <ListItemText>
            {hoot} - {name} - {score}
          </ListItemText>
        </ListItem>
      );
    });

  return (
    <>
      <ProgressBarCountdownTimer countdownSeconds={60} />
      <Typography variant="h3">Waiting for hoot to answer...</Typography>
      <Paper elevation={1}>
        <List subheader={<ListSubheader>Current scoreboard</ListSubheader>}>
          {scoreBoard}
        </List>
      </Paper>
    </>
  );
};

export default WaitingForAnswer;
