import React from 'react';
import OuterGrid from '../common/OuterGrid';
import CenteredInnerGrid from '../common/CenteredInnerGrid';
import { Grid, Paper, Typography, makeStyles } from '@material-ui/core';
import HootAvatar from '../common/HootAvatar';

const useStyles = makeStyles(theme => ({
  notice: {
    padding: theme.spacing(2),
  },
}));

const LoggedInElsewhere: React.FC = () => {
  const classes = useStyles();
  return (
    <OuterGrid>
      <CenteredInnerGrid>
        <Grid item>
          <Paper elevation={3} className={classes.notice}>
            <HootAvatar size="large" number={1} />
            <Typography variant="body1">
              Hoot Dat is open in another window. Use the other window to play
              instead.
            </Typography>
          </Paper>
        </Grid>
      </CenteredInnerGrid>
    </OuterGrid>
  );
};

export default LoggedInElsewhere;
