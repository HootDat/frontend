import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Grid,
  makeStyles,
} from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import BackButton from '../common/BackButton';
import CenteredInnerGrid from '../common/CenteredInnerGrid';
import ActionButton from '../common/ActionButton';
import HootAvatar from '../common/HootAvatar';

const useStyles = makeStyles(theme => ({
  pageSelector: {
    padding: theme.spacing(2),
  },
  hootButton: {
    textAlign: 'center',
    display: 'inline-block',
    height: '60px',
    width: '60px',
    paddingTop: '5px',
  },
  selected: {
    backgroundColor: '#fdd9b6',
    borderRadius: '50%',
  },
}));

const CreatePlayer: React.FC<{
  handleCreate: (name: string, hoot: number) => void;
  handleBack: () => void;
}> = ({ handleCreate, handleBack }) => {
  // 0 to 11, inclusive
  const [hoot, setHoot] = useState(-1);
  // 1 or 2
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const classes = useStyles();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 9) return;
    setName(e.target.value);
  };

  const makeHootRow = (firstHootId: number) => {
    return (
      <Grid item container justify="center" alignItems="center" spacing={1}>
        {makeHootButton(firstHootId)}
        {makeHootButton(firstHootId + 1)}
        {makeHootButton(firstHootId + 2)}
      </Grid>
    );
  };

  const makeHootButton = (hootNumber: number) => {
    // temporarily mark selected using button color, ideally this should
    // be done with CSS.
    return (
      <Grid item>
        <span
          className={`${classes.hootButton} ${
            hoot === hootNumber ? classes.selected : ''
          }`}
        >
          <HootAvatar number={hootNumber} onClick={() => setHoot(hootNumber)} />
        </span>
      </Grid>
    );
  };

  const PageSelector = (
    <>
      <Grid item>
        <Button size="small" onClick={() => setPage(1)} disabled={page === 1}>
          <KeyboardArrowLeft />
        </Button>
      </Grid>
      <Grid item>
        <Typography variant="body2">{page}/2</Typography>
      </Grid>
      <Grid item>
        <Button size="small" onClick={() => setPage(2)} disabled={page === 2}>
          <KeyboardArrowRight />
        </Button>
      </Grid>
    </>
  );

  const HootPage = (
    <>
      <Grid item container direction="column" spacing={1} xs={12}>
        {makeHootRow(page === 1 ? 0 : 6)}
        {makeHootRow(page === 1 ? 3 : 9)}
      </Grid>
      <Grid
        item
        container
        justify="center"
        alignItems="center"
        spacing={2}
        xs={12}
        className={classes.pageSelector}
      >
        {PageSelector}
      </Grid>
    </>
  );

  return (
    <CenteredInnerGrid>
      <Grid item xs={12}>
        <Typography variant="h4">Pick your hoot</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">Hurry before they fly away</Typography>
      </Grid>
      <Grid item container xs={12}>
        {HootPage}
      </Grid>
      <Grid item xs={12}>
        <TextField
          placeholder="Your name"
          helperText="Less than 10 characters"
          label="Name"
          variant="outlined"
          fullWidth
          onChange={handleNameChange}
          value={name}
        />
      </Grid>
      <Grid item xs={12}>
        <ActionButton
          variant="contained"
          color="primary"
          disabled={hoot === -1 || name === ''}
          onClick={() => handleCreate(name, hoot)}
        >
          CREATE HOOT
        </ActionButton>
      </Grid>
      <Grid item xs={12}>
        <BackButton handleBack={handleBack} />
      </Grid>
    </CenteredInnerGrid>
  );
};

export default CreatePlayer;
