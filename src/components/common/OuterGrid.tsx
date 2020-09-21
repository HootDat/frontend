import React from 'react';
import { makeStyles, GridProps, Grid } from '@material-ui/core';

const useStyles = makeStyles({
  root: {
    height: '100%',
  },
});

const OuterGrid: React.FC<GridProps> = props => {
  const classes = useStyles();

  return (
    <Grid
      container
      alignItems="center"
      justify="center"
      className={classes.root}
      {...props}
    />
  );
};

export default OuterGrid;
