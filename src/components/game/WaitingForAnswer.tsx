import React, { useContext } from 'react';
import { Typography, makeStyles, Grid } from '@material-ui/core';

import GameContext from './GameContext';
import ScoreBoard from './common/ScoreBoard';
import OuterGrid from '../common/OuterGrid';
import CenteredInnerGrid from '../common/CenteredInnerGrid';
import HootAvatar from '../common/HootAvatar';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '0 auto',
    maxWidth: '600px',
    position: 'relative',
    height: '100%',
    textAlign: 'center',
  },
  header: {
    position: 'absolute',
    width: '100%',
    top: '24px',
  },
}));

const WaitingForAnswer: React.FC = () => {
  const { state } = useContext(GameContext);
  const classes = useStyles();
  const { results: fullResults, qnNum, players, host } = state!;

  // -1 as we are showing previous round's results
  return (
    <div className={classes.root}>
      <OuterGrid>
        <CenteredInnerGrid>
          <Grid item xs={12}>
            <HootAvatar size="large" />
            <Typography variant="h4">Waiting for hoot to answer...</Typography>
          </Grid>
          {qnNum > 0 && (
            <Grid item xs={12}>
              <ScoreBoard
                header
                host={host!}
                results={fullResults[qnNum - 1]}
                players={players}
              />
            </Grid>
          )}
        </CenteredInnerGrid>
      </OuterGrid>
    </div>
  );
};

export default WaitingForAnswer;
