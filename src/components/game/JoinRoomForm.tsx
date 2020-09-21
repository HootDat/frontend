import React, { useState } from 'react';
import { TextField, Button, Typography, styled } from '@material-ui/core';

const PinField = styled(TextField)({
  letterSpacing: '1rem',
  outline: 'none',
  width: '13rem',
  '& input': {
    textAlign: 'center',
    fontSize: '3rem',
  },
});

// load form if room in state is empty. otherwise load character.
const JoinRoomForm: React.FC<{
  handleJoin: (roomId: string) => void;
  handleBack: () => void;
}> = ({ handleJoin, handleBack }) => {
  const [input, setInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9\b]{0,4}$/;

    if (re.test(e.target.value)) setInput(e.target.value);
  };

  return (
    <>
      <Typography variant="h4">Enter Room PIN</Typography>
      <PinField
        placeholder="XXXX"
        onChange={handleChange}
        value={input}
        autoFocus
      />
      <Button
        variant="contained"
        color="primary"
        disabled={input.length !== 4}
        onClick={() => handleJoin(input)}
      >
        Join Room
      </Button>
      <Button color="primary" onClick={handleBack}>
        Back
      </Button>
    </>
  );
};

export default JoinRoomForm;
