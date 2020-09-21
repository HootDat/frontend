import React, { useState } from 'react';
import {
  TextField,
  Typography,
  styled,
  makeStyles,
  Grid,
} from '@material-ui/core';
import BackButton from '../common/BackButton';
import hoot from '../../svg/hoot0.svg';
import ActionButton from '../common/ActionButton';
import CenteredInnerGrid from '../common/CenteredInnerGrid';

const PinField = styled(TextField)({
  letterSpacing: '1rem',
  outline: 'none',
  width: '13rem',
  '& input': {
    textAlign: 'center',
    fontSize: '3rem',
  },
});

const useStyles = makeStyles(theme => ({
  container: {
    textAlign: 'center',
    maxWidth: '600px',
  },
  hoot: {
    width: '100px',
    height: '100px',
  },
}));

// load form if room in state is empty. otherwise load character.
const JoinRoomForm: React.FC<{
  handleJoin: (roomId: string) => void;
  handleBack: () => void;
}> = ({ handleJoin, handleBack }) => {
  const [input, setInput] = useState('');
  const classes = useStyles();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9\b]{0,4}$/;

    if (re.test(e.target.value)) setInput(e.target.value);
  };

  return (
    <CenteredInnerGrid>
      <Grid item xs={12}>
        <img src={hoot} className={classes.hoot} alt="hootdat mascot" />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h4">Enter Room PIN</Typography>
      </Grid>
      <Grid item xs={12}>
        <PinField
          placeholder="XXXX"
          onChange={handleChange}
          value={input}
          autoFocus
        />
      </Grid>
      <Grid item xs={12}>
        <ActionButton
          variant="contained"
          color="primary"
          disabled={input.length !== 4}
          onClick={() => handleJoin(input)}
        >
          Join Game
        </ActionButton>
      </Grid>
      <Grid item xs={12}>
        <BackButton handleBack={handleBack} />
      </Grid>
    </CenteredInnerGrid>
  );
};

export default JoinRoomForm;
