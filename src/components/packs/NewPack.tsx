import React from 'react';
import { Typography } from '@material-ui/core';

import QuestionPackForm from './QuestionPackForm';

const NewPack: React.FC = () => {
  // fetch categories on load

  // TODO dump into local storage
  // queue a request to send the questions to server if logged in
  // so that it is synced on the cloud
  // add an option to specify whether it is seen in public
  const handleSubmit = () => {};

  const categories = ['fun', 'party', 'random'];

  return (
    <>
      <Typography variant="h3">Create question pack</Typography>
      <QuestionPackForm categories={categories} handleSubmit={handleSubmit} />
    </>
  );
};

export default NewPack;
