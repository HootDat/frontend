import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, makeStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import store from '../../utils/store';
import QuestionPackList from './QuestionPackList';
import BackButton from '../common/BackButton';
import PaddedDiv from '../common/PaddedDiv';
import ActionButton from '../common/ActionButton';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '0 auto',
    maxWidth: '600px',
    position: 'relative',
    height: '100%',
    textAlign: 'center',
  },
  buttonGroup: {
    position: 'absolute',
    width: '100%',
    bottom: '0px',
  },
  button: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  container: {
    height: 'calc(100% - 96px)',
  },
}));

const Packs: React.FC = () => {
  const history = useHistory();
  const [hideButtons, setHideButtons] = useState(false);
  const classes = useStyles();

  // TODO if local store is not available, show an error text instead

  // we disable creating packs if local store is not available.
  return (
    <PaddedDiv>
      <div className={classes.root}>
        <div className={classes.container}>
          <QuestionPackList hideOutsideContent={setHideButtons} />
        </div>
        {!hideButtons && (
          <div className={classes.buttonGroup}>
            <ActionButton
              color="primary"
              variant="contained"
              disabled={!store.isAvailable()}
              className={classes.button}
              onClick={() => history.push('/packs/new')}
            >
              <Add /> CREATE QUESTION PACK
            </ActionButton>
            <BackButton
              text="Back to home"
              handleBack={() => history.push('/')}
              className={classes.button}
            />
          </div>
        )}
      </div>
    </PaddedDiv>
  );
};

export default Packs;
