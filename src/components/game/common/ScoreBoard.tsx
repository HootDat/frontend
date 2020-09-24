import React from 'react';
import {
  Box,
  ListItem,
  Paper,
  List,
  ListSubheader,
  Typography,
  makeStyles,
  Chip,
} from '@material-ui/core';
import HootAvatar from '../../common/HootAvatar';
import { Player, Result } from '../GameState';

const useStyles = makeStyles(theme => ({
  cardListings: {
    height: '160px',
    overflow: 'auto',
    width: '100%',
  },
  playerText: {
    flex: 1,
    paddingLeft: theme.spacing(1),
  },
  listItem: {
    display: 'flex',
  },
}));

const ScoreBoard: React.FC<{
  header?: boolean;
  winning?: boolean;
  host?: string;
  results: Result[];
  players: { [cId: string]: Player };
}> = ({ header, winning, host, results, players }) => {
  const classes = useStyles();

  const defaultSort = (a: Result, b: Result) =>
    a.cId === host ? -1 : a.cId.localeCompare(b.cId);

  const winningSort = (a: Result, b: Result) => b.score - a.score;

  const scoreBoard = results
    .sort(winning ? winningSort : defaultSort)
    .map((result, index) => {
      return (
        <ListItem key={result.cId} className={classes.listItem}>
          <HootAvatar number={players[result.cId].iconNum} size="xsmall" />
          <Typography variant="body1" className={classes.playerText}>
            <Box
              fontWeight={winning && index === 0 ? 'fontWeightBold' : undefined}
              display="inline"
            >
              {players[result.cId].name}
            </Box>
          </Typography>
          <Chip size="small" color="secondary" label={`${result.score}PT`} />
        </ListItem>
      );
    });

  return (
    <Paper elevation={1} className={header ? classes.cardListings : undefined}>
      <List dense>
        {header && <ListSubheader>Current scoreboard</ListSubheader>}
        {scoreBoard}
      </List>
    </Paper>
  );
};

export default ScoreBoard;
