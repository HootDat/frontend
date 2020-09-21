import React from 'react';
import { makeStyles, GridProps, Grid } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    textAlign: 'center',
    maxWidth: '600px',
  },
});

const CenteredInnerGrid: React.FC<GridProps> = props => {
  const classes = useStyles();

  return (
    <Grid
      item
      container
      xs={12}
      spacing={2}
      className={classes.root}
      {...props}
    />
  );
};

export default CenteredInnerGrid;
