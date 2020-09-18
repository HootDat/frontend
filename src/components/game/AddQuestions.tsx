import React, { useState } from 'react';
import { Typography, Button } from '@material-ui/core';
import EditQuestionsList from '../packs/EditQuestionsList';

const AddQuestions: React.FC<{
  roomQuestions: string[];
  setRoomQuestions: (questions: string[]) => void;
  handleBack: () => void;
}> = ({ roomQuestions, setRoomQuestions, handleBack }) => {
  const [questions, setQuestions] = useState([...roomQuestions]);

  const handleAdd = () => {
    const trimmed = questions.map(s => s.trim());
    if (trimmed.includes('')) return;
    setRoomQuestions([...trimmed]);
    handleBack();
  };

  const handleAddFromPack = () => {
    // TODO
  };

  return (
    <>
      <Typography variant="h3">Add questions</Typography>
      <Button
        size="small"
        variant="contained"
        color="secondary"
        onClick={handleAddFromPack}
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
