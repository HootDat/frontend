import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import store from '../../utils/store';
import QuestionPackForm from './QuestionPackForm';
import { LocalQuestionPack } from '../../types/questionPack';
import { Typography, makeStyles, Box } from '@material-ui/core';
import { Category } from '../../types/category';
import useOnlineStatus from '../../utils/useOnlineStatus';
import categoriesAPI from '../../api/categories';
import AuthContext from '../login/AuthContext';
import packsAPI from '../../api/packs';
import PaddedDiv from '../common/PaddedDiv';
import HootAvatar from '../common/HootAvatar';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '0 auto',
    maxWidth: '600px',
    position: 'relative',
    height: '100%',
  },
}));

type Params = {
  id: string;
};

type LocationState = {
  localOnly: boolean;
};

// can only edit if in local storage
const PackEdit: React.FC = () => {
  const params = useParams<Params>();
  const location = useLocation<LocationState>();
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const id = parseInt(params.id, 10);
  const classes = useStyles();

  const [categories, setCategories] = useState([] as Category[]);
  const online = useOnlineStatus();

  // if it is a local pack that is unsynced, use a negative id instead.
  const editPack = store.getLocalPack(location.state.localOnly ? -id : id);

  const handleSubmit = (pack: LocalQuestionPack) => {
    let promise;
    if (user === null || !online) {
      store.editLocalPack(pack);
      promise = Promise.resolve();
    } else if (pack.action === 'new') {
      // pack is new and not synced with server
      promise = packsAPI.newPack({ ...pack, id: 0 }).then(
        newPack => {
          store.deletePack(pack.id);
          store.downloadPack(newPack);
        },
        () => store.editLocalPack(pack)
      );
    } else {
      promise = packsAPI.editPack({ ...pack }).then(
        editedPack => store.downloadPack(editedPack),
        () => store.editLocalPack(pack)
      );
    }
    promise.finally(() => history.push('/packs'));
  };

  useEffect(() => {
    const setLocalCategories = () => setCategories(store.getCategories());
    if (!online) {
      setLocalCategories();
      return;
    }

    categoriesAPI
      .getCategories()
      .then(
        categories => setCategories([...categories, ...store.getCategories()]),
        setLocalCategories
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PaddedDiv>
      <div className={classes.root}>
        <Box textAlign="center">
          <HootAvatar size="small" />
          <Typography variant="h4">Edit question pack</Typography>
        </Box>
        <QuestionPackForm
          handleSubmit={handleSubmit}
          editPack={editPack}
          categories={categories}
        />
      </div>
    </PaddedDiv>
  );
};

export default PackEdit;
