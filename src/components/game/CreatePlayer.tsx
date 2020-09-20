import React, { useState } from 'react';
import { Typography, TextField, Button, ButtonGroup } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';

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
      <Button size="small" onClick={() => setPage(1)} disabled={page === 1}>
        <KeyboardArrowLeft />
      </Button>
      <Typography variant="body2">{page}/2</Typography>
      <Button size="small" onClick={() => setPage(2)} disabled={page === 2}>
        <KeyboardArrowRight />
      </Button>
    </>
  );

  const HootPage = (
    <>
      <ButtonGroup orientation="vertical" aria-label="hoot choices">
        {makeHootRow(page === 1 ? 0 : 6)}
        {makeHootRow(page === 1 ? 3 : 9)}
      </ButtonGroup>
      {PageSelector}
    </>
  );

  return (
    <>
      <Typography variant="h4">Pick your hoot</Typography>
      <Typography variant="body1">Hurry before they fly away</Typography>
      {HootPage}
      <TextField
        placeholder="Your name"
        onChange={handleNameChange}
        value={name}
      />
      <Button
        variant="contained"
        color="primary"
        disabled={hoot === -1 || name === ''}
        onClick={() => handleCreate(name, hoot)}
      >
        CREATE HOOT
      </Button>
      <Button onClick={handleBack}>BACK</Button>
    </>
  );
};

export default CreatePlayer;
