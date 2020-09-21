import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import store from '../../utils/store';
import QuestionPackList from './QuestionPackList';
import BackButton from '../common/BackButton';

const Packs: React.FC = () => {
  const history = useHistory();

  // TODO if local store is not available, show an error text instead

  // we disable creating packs if local store is not available.
  return (
    <>
      <QuestionPackList />
      <Button
        color="primary"
        variant="contained"
        disabled={!store.isAvailable()}
        onClick={() => history.push('/packs/new')}
      >
        <Add /> CREATE QUESTION PACK
      </Button>
      <BackButton handleBack={() => history.push('/')} />
    </>
  );
};

export default Packs;
