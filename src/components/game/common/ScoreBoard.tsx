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
import HootAvatar from '../../common/HootAvatar';
import { Player } from '../GameState';

const ScoreBoard: React.FC<{
  header?: boolean;
  winning?: boolean;
  host?: string;
  players: { [cid: string]: Player };
}> = ({ header, winning, host, players }) => {
  const defaultSort = (a: [string, Player], b: [string, Player]) =>
    a[0] === host ? -1 : a[0].localeCompare(b[0]);

  const winningSort = (a: [string, Player], b: [string, Player]) =>
    b[1].score - a[1].score;

  const scoreBoard = Object.entries(players)
    .sort(winning ? winningSort : defaultSort)
    .map(([cid, player], index) => {
      return (
        <ListItem key={cid}>
          <ListItemText>
            <Typography variant="body2">
              <HootAvatar number={player.iconNum} size="xsmall" />
              <Box
                fontWeight={
                  winning && index === 0 ? 'fontWeightBold' : undefined
                }
                display="inline"
              >
                {player.name}
              </Box>{' '}
              - {player.score}PT
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
