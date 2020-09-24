import React, { useState } from 'react';
import { Typography, Button, Grid, makeStyles } from '@material-ui/core';
import EditQuestionsList from '../packs/EditQuestionsList';
import QuestionPackList from '../packs/QuestionPackList';
import BackButton from '../common/BackButton';
import HootAvatar from '../common/HootAvatar';

import ActionButton from '../common/ActionButton';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '0 auto',
    maxWidth: '600px',
    position: 'relative',
    height: '100%',
    textAlign: 'center',
  },
  smallButton: {
    borderRadius: 40,
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
  header: {
    paddingTop: '20px',
  },
  container: {
    height: 'calc(100% - 258px)',
    overflow: 'auto',
    marginTop: theme.spacing(2),
  },
  containerAddingFromPack: {
    height: 'calc(100% - 178px)',
    overflow: 'auto',
    marginTop: theme.spacing(2),
  },
}));

const AddQuestions: React.FC<{
  roomQuestions: string[];
  setRoomQuestions: (questions: string[]) => void;
  handleBack: () => void;
}> = ({ roomQuestions, setRoomQuestions, handleBack }) => {
  const [questions, setQuestions] = useState([...roomQuestions]);
  const [addingFromPack, setAddingFromPack] = useState(false);
  const [hideButton, setHideButton] = useState(false);

  const handleAdd = () => {
    const trimmed = questions.map(s => s.trim());
    if (trimmed.includes('')) return;
    setRoomQuestions([...trimmed]);
    handleBack();
  };

  const handleAddFromPack = (packQuestions: string[]) => {
    setQuestions([...questions, ...packQuestions]);
    setAddingFromPack(false);
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container direction="column" spacing={1} className={classes.header}>
        <Grid item>
          <HootAvatar size="small" />
        </Grid>
        <Grid item>
          <Typography variant="h4">Add questions</Typography>
        </Grid>
        {addingFromPack ? undefined : (
          <Grid item>
            <Button
              size="small"
              variant="contained"
              color="secondary"
              onClick={() => setAddingFromPack(true)}
              className={classes.smallButton}
            >
              ADD FROM PACK
            </Button>
          </Grid>
        )}
      </Grid>
      <div
        className={
          addingFromPack ? classes.containerAddingFromPack : classes.container
        }
      >
        {addingFromPack ? (
          <QuestionPackList
            inRoom
            handleAdd={handleAddFromPack}
            hideOutsideContent={setHideButton}
          />
        ) : (
          <EditQuestionsList
            questions={questions}
            setQuestions={setQuestions}
          />
        )}
      </div>
      {addingFromPack && !hideButton && (
        <div className={classes.buttonGroup}>
          <BackButton
            text="Back to questions"
            handleBack={() => setAddingFromPack(false)}
            className={classes.button}
          />
        </div>
      )}
      {!addingFromPack && (
        <div className={classes.buttonGroup}>
          <ActionButton
            variant="contained"
            color="primary"
            onClick={handleAdd}
            className={classes.button}
          >
            SAVE QUESTIONS
          </ActionButton>
          <BackButton
            text="back to room"
            handleBack={handleBack}
            className={classes.button}
          />
        </div>
      )}
    </div>
  );
};

export default AddQuestions;
