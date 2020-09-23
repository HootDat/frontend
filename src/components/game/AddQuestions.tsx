import React, { useState } from 'react';
import { Typography, Button, Grid, makeStyles } from '@material-ui/core';
import EditQuestionsList from '../packs/EditQuestionsList';
import QuestionPackList from '../packs/QuestionPackList';
import BackButton from '../common/BackButton';
import HootAvatar from '../common/HootAvatar';

import ActionButton from '../common/ActionButton';
import OuterGrid from '../common/OuterGrid';
import CenteredInnerGrid from '../common/CenteredInnerGrid';

const useStyles = makeStyles(theme => ({
  smallButton: {
    borderRadius: 40,
  },
}));

const AddQuestions: React.FC<{
  roomQuestions: string[];
  setRoomQuestions: (questions: string[]) => void;
  handleBack: () => void;
}> = ({ roomQuestions, setRoomQuestions, handleBack }) => {
  const [questions, setQuestions] = useState([...roomQuestions]);
  const [addingFromPack, setAddingFromPack] = useState(false);

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
    <>
      <OuterGrid>
        <CenteredInnerGrid>
          <Grid item xs={12}>
            <HootAvatar size="small" />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">Add questions</Typography>
          </Grid>
          {addingFromPack ? (
            <QuestionPackList
              inRoom
              handleAdd={handleAddFromPack}
              handleBack={() => setAddingFromPack(false)}
            />
          ) : (
            <>
              <Grid item xs={12}>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={() => setAddingFromPack(true)}
                  className={classes.smallButton}
                  // style={
                  //     {borderRadius:40,
                  //     width: 'auto'
                  //     }
                  // }
                >
                  ADD FROM PACK
                </Button>
              </Grid>

              <Grid item xs={12}>
                <EditQuestionsList
                  questions={questions}
                  setQuestions={setQuestions}
                />
              </Grid>
              <Grid item xs={12}>
                <ActionButton
                  variant="contained"
                  color="primary"
                  onClick={handleAdd}
                >
                  SAVE QUESTIONS
                </ActionButton>
              </Grid>
              <Grid item xs={12}>
                <BackButton handleBack={handleBack} />
              </Grid>
            </>
          )}
        </CenteredInnerGrid>
      </OuterGrid>
    </>
  );
};

export default AddQuestions;
