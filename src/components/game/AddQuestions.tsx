import React, { useState } from 'react';
import { Typography, Button } from '@material-ui/core';
import EditQuestionsList from '../packs/EditQuestionsList';
import QuestionPackList from '../packs/QuestionPackList';

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

  return addingFromPack ? (
    <QuestionPackList
      inRoom
      handleAdd={handleAddFromPack}
      handleBack={() => setAddingFromPack(false)}
    />
  ) : (
    <>
      <Typography variant="h4">Add questions</Typography>
      <Button
        size="small"
        variant="contained"
        color="secondary"
        onClick={() => setAddingFromPack(true)}
      >
        ADD FROM PACK
      </Button>
      <EditQuestionsList questions={questions} setQuestions={setQuestions} />
      <Button variant="contained" color="primary" onClick={handleAdd}>
        SAVE QUESTIONS
      </Button>
      <Button color="primary" onClick={handleBack}>
        BACK
      </Button>
    </>
  );
};

export default AddQuestions;
