import React from 'react';
import OuterGrid from '../common/OuterGrid';
import CenteredInnerGrid from '../common/CenteredInnerGrid';
import { Grid, Paper, Typography } from '@material-ui/core';

const LoggedInElsewhere: React.FC = () => {
  return (
    <OuterGrid>
      <CenteredInnerGrid>
        <Grid item>
          <Paper elevation={3}>
            <Typography variant="body1">
              Hoot Dat is open in another window. Use the the other window to
              play instead.
            </Typography>
          </Paper>
        </Grid>
      </CenteredInnerGrid>
    </OuterGrid>
  );
};

export default LoggedInElsewhere;
