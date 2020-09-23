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
import { Player, Result } from '../GameState';

const ScoreBoard: React.FC<{
  header?: boolean;
  winning?: boolean;
  host?: string;
  results: Result[];
  players: { [cId: string]: Player };
}> = ({ header, winning, host, results, players }) => {
  const defaultSort = (a: Result, b: Result) =>
    a.cId === host ? -1 : a.cId.localeCompare(b.cId);

  const winningSort = (a: Result, b: Result) => b.score - a.score;

  const scoreBoard = results
    .sort(winning ? winningSort : defaultSort)
    .map((result, index) => {
      return (
        <ListItem key={result.cId}>
          <ListItemText>
            <Typography variant="body2">
              <HootAvatar number={players[result.cId].iconNum} size="xsmall" />
              <Box
                fontWeight={
                  winning && index === 0 ? 'fontWeightBold' : undefined
                }
                display="inline"
              >
                {players[result.cId].name}
              </Box>{' '}
              - {result.score}PT
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
