import React from 'react';
import OuterGrid from './common/OuterGrid';
import CenteredInnerGrid from './common/CenteredInnerGrid';
import PaddedDiv from './common/PaddedDiv';

import { useHistory } from 'react-router-dom';
import { Grid, Typography } from '@material-ui/core';

import BackButton from './common/BackButton';
import HootAvatar from './common/HootAvatar';

const NotFound: React.FC = () => {
  const history = useHistory();
  return (
    <PaddedDiv>
      <OuterGrid>
        <CenteredInnerGrid>
          <Grid item xs={12}>
            <HootAvatar size="large" />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">Page Not Found</Typography>
          </Grid>
          <Grid item xs={12}>
            <BackButton
              text="Back to home"
              handleBack={() => history.push('/')}
            />
          </Grid>
        </CenteredInnerGrid>
      </OuterGrid>
    </PaddedDiv>
  );
};

export default NotFound;
