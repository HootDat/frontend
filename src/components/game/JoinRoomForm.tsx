import React, { useState } from 'react';
import { TextField, Button, Typography } from '@material-ui/core';

// load form if room in state is empty. otherwise load character.
const JoinRoomForm: React.FC<{
  handleSubmit: (roomId: string) => void;
  handleBack: () => void;
}> = ({ handleSubmit, handleBack }) => {
  const [input, setInput] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9\b]{0,4}$/;

    if (re.test(e.target.value)) setInput(e.target.value);
  };

  const handleClick = () => handleSubmit(input);

  return (
    <>
      <Typography variant="h3">Enter Room PIN</Typography>
      <TextField placeholder="XXXX" onChange={handleChange} value={input} />
      <Button
        variant="contained"
        color="primary"
        disabled={input.length !== 4}
        onClick={handleClick}
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
