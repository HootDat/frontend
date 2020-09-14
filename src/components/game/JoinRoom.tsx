import React, { useState, useContext } from 'react';
import { TextField, Button, Typography } from '@material-ui/core';
import GameContext from './GameContext';
import { Mode } from './GameState';

const JoinRoom: React.FC = () => {
  const [input, setInput] = useState('');
  const context = useContext(GameContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const re = /^[0-9\b]{0,4}$/;

    if (re.test(e.target.value)) setInput(e.target.value);
  };

  const handleJoin = () => {
    context.joinRoom(input);
  };

  const handleBack = () => {
    context.updateMode(Mode.HOME);
  };

  return (
    <>
      <Typography variant="h3">Enter Room PIN</Typography>
      <TextField placeholder="XXXX" onChange={handleChange} value={input} />
      <Button
        variant="contained"
        color="primary"
        disabled={input.length !== 4}
        onClick={handleJoin}
      >
        Join Room
      </Button>
      <Button color="primary" onClick={handleBack}>
        Back
      </Button>
    </>
  );
};

export default JoinRoom;
