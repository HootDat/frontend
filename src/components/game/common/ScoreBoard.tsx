import React from 'react';
import {
  ListItem,
  ListItemText,
  Paper,
  List,
  ListSubheader,
} from '@material-ui/core';

const ScoreBoard: React.FC<{
  header?: boolean;
  hostCid?: string;
  participants: { [key: string]: [string, number, number] };
}> = ({ header, hostCid, participants }) => {
  const scoreBoard = Object.entries(participants)
    .sort((a, b) => (a[0] === hostCid ? -1 : a[0].localeCompare(b[0])))
    .map(([cid, [name, hoot, score]]) => {
      return (
        <ListItem key={cid}>
          <ListItemText>
            {hoot} - {name} - {score}PT
          </ListItemText>
        </ListItem>
      );
    });

  return (
    <Paper elevation={1}>
      <List
        subheader={
          header ? <ListSubheader>Current scoreboard</ListSubheader> : undefined
        }
      >
        {scoreBoard}
      </List>
    </Paper>
  );
};

export default ScoreBoard;
