import React, { useState, useContext } from 'react';
import { TextField, Button } from '@material-ui/core';
import GameContext from './GameContext';
import { Mode } from './GameState';

const JoinRoom: React.FC = () => {
  const [input, setInput] = useState('');
  const context = useContext(GameContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleJoin = () => {
    context.joinRoom(input);
  };

  const handleBack = () => {
    context.updateMode(Mode.HOME);
  };

  return (
    <>
      <TextField placeholder="XXXX" onChange={handleChange} value={input} />
      <Button variant="contained" color="primary" onClick={handleJoin}>
        Join Room
      </Button>
      <Button color="primary" onClick={handleBack}>
        Back
      </Button>
    </>
  );
};

export default JoinRoom;
