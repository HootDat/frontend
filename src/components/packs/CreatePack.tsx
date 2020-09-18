import React, { useState } from 'react';
import { Typography, TextField, Button } from '@material-ui/core';
import EditQuestionsList from './EditQuestionsList';
import { useHistory } from 'react-router-dom';

const CreatePack: React.FC = () => {
  const [packName, setPackName] = useState('');
  const [questions, setQuestions] = useState([] as string[]);

  const history = useHistory();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPackName(e.target.value);
  };

  // TODO dump into local storage
  // queue a request to send the questions to server if logged in
  // so that it is synced on the cloud
  // add an option to specify whether it is seen in public
  const handleSubmit = () => {};

  return (
    <>
      <Typography variant="h3">Create question pack</Typography>
      <TextField
        label="Pack name"
        value={packName}
        onChange={handleNameChange}
      />
      <EditQuestionsList questions={questions} setQuestions={setQuestions} />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        CREATE PACK
      </Button>
      <Button color="primary" onClick={() => history.push('/packs')}>
        BACK
      </Button>
    </>
  );
};

export default CreatePack;
