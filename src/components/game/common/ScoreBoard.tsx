import React from 'react';
import {
  Box,
  ListItem,
  ListItemText,
  Paper,
  List,
  ListSubheader,
  Typography,
} from '@material-ui/core';

const ScoreBoard: React.FC<{
  header?: boolean;
  winning?: boolean;
  hostCid?: string;
  participants: { [key: string]: [string, number, number] };
}> = ({ header, winning, hostCid, participants }) => {
  const defaultSort = (
    a: [string, [string, number, number]],
    b: [string, [string, number, number]]
  ) => (a[0] === hostCid ? -1 : a[0].localeCompare(b[0]));

  const winningSort = (
    a: [string, [string, number, number]],
    b: [string, [string, number, number]]
  ) => b[1][2] - a[1][2];

  const scoreBoard = Object.entries(participants)
    .sort(winning ? winningSort : defaultSort)
    .map(([cid, [name, hoot, score]], index) => {
      return (
        <ListItem key={cid}>
          <ListItemText>
            <Typography variant="body2">
              {hoot} -{' '}
              <Box
                fontWeight={
                  winning && index === 0 ? 'fontWeightBold' : undefined
                }
                display="inline"
              >
                {name}
              </Box>{' '}
              - {score}PT
            </Typography>
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
