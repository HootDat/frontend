import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  ButtonGroup,
  Grid,
  makeStyles,
} from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';
import BackButton from '../common/BackButton';
import CenteredInnerGrid from '../common/CenteredInnerGrid';
import ActionButton from '../common/ActionButton';

const useStyles = makeStyles(theme => ({
  pageSelector: {
    padding: theme.spacing(2),
  },
}));

const CreatePlayer: React.FC<{
  handleCreate: (name: string, hoot: number) => void;
  handleBack: () => void;
  participants: { [key: string]: [string, number, number] };
}> = ({ handleCreate, handleBack, participants }) => {
  // 0 to 11, inclusive
  const [hoot, setHoot] = useState(-1);
  // 1 or 2
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');
  const classes = useStyles();

  const occupiedNumbers = Object.values(participants).map(arr => arr[1]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const makeHootRow = (firstHootId: number) => {
    return (
      <ButtonGroup aria-label="hoot row">
        {makeHootButton(firstHootId)}
        {makeHootButton(firstHootId + 1)}
        {makeHootButton(firstHootId + 2)}
      </ButtonGroup>
    );
  };

  const makeHootButton = (hootNumber: number) => {
    // temporarily mark selected using button color, ideally this should
    // be done with CSS.
    const variant = hoot === hootNumber ? 'contained' : undefined;
    return (
      <Button
        variant={variant}
        color="primary"
        id={hootNumber.toString()}
        disabled={occupiedNumbers.includes(hootNumber)}
        onClick={() => setHoot(hootNumber)}
      >
        {hootNumber}
      </Button>
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
      <Grid item xs={12}>
        <ButtonGroup orientation="vertical" aria-label="hoot choices">
          {makeHootRow(page === 1 ? 0 : 6)}
          {makeHootRow(page === 1 ? 3 : 9)}
        </ButtonGroup>
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
