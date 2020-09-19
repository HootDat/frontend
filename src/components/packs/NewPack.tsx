import React, { useContext } from 'react';
import { Typography } from '@material-ui/core';

import QuestionPackForm from './QuestionPackForm';
import { QuestionPackPostData } from '../../types/questionPack';
import store from '../../utils/store';
import AuthContext from '../login/AuthContext';
import { useHistory } from 'react-router-dom';

const NewPack: React.FC = () => {
  const { name } = useContext(AuthContext);
  const history = useHistory();
  // fetch categories on load

  // TODO dump into local storage
  // queue a request to send the questions to server if logged in
  // so that it is synced on the cloud
  // add an option to specify whether it is seen in public
  const handleSubmit = (pack: QuestionPackPostData) => {
    // TODO figure out how service workers work. We should try
    // to push the changes here, and resort to service workers if
    // it fails? idk. will figure this out next.
    store.newLocalPack(pack, name);
    history.push('/packs');
  };

  const categories = ['fun', 'party', 'random'];

  return (
    <>
      <Typography variant="h3">Create question pack</Typography>
      <QuestionPackForm categories={categories} handleSubmit={handleSubmit} />
    </>
  );
};

export default NewPack;
