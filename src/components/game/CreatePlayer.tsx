import React, { useState } from 'react';
import { Typography, TextField, Button, ButtonGroup } from '@material-ui/core';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@material-ui/icons';

const CreatePlayer: React.FC<{
  handleSubmit: (name: string, hoot: number) => void;
}> = ({ handleSubmit }) => {
  // 0 to 11, inclusive
  const [hoot, setHoot] = useState(-1);
  // 0 or 1
  const [page, setPage] = useState(1);
  const [name, setName] = useState('');

  // TODO disabled owls for when joining a room

  const handleHootSelect = (hootNumber: number) => {
    // temporarily identify each one by id, shd pick something better
    return () => setHoot(hootNumber);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const changePage = (page: number) => {
    return () => setPage(page);
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
        onClick={handleHootSelect(hootNumber)}
      >
        {hootNumber}
      </Button>
    );
  };

  const pageSelector = (
    <>
      <Button size="small" onClick={changePage(1)} disabled={page === 1}>
        <KeyboardArrowLeft />
      </Button>
      {page}/2
      <Button size="small" onClick={changePage(2)} disabled={page === 2}>
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
      {pageSelector}
    </>
  );

  return (
    <>
      <Typography variant="h3">Pick your hoot</Typography>
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
        onClick={() => handleSubmit(name, hoot)}
      >
        CREATE ROOM
      </Button>
    </>
  );
};

export default CreatePlayer;
