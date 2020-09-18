import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import localStorage from '../../utils/localStorage';

const Packs: React.FC = () => {
  const history = useHistory();

  // TODO if local storage is not available, show an error text instead

  // we disable creating packs if local storage is not available.
  return (
    <>
      <Button
        color="primary"
        variant="contained"
        disabled={!localStorage.isAvailable()}
        onClick={() => history.push('/packs/create')}
      >
        <Add /> CREATE QUESTION PACK
      </Button>
      <Button color="primary" onClick={() => history.push('/')}>
        BACK
      </Button>
    </>
  );
};

export default Packs;
