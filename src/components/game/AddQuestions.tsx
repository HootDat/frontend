import React, { useState } from 'react';
import { Typography, Button, TextField } from '@material-ui/core';
import { Add, Clear } from '@material-ui/icons';

const AddQuestions: React.FC<{
  roomQuestions: string[];
  setRoomQuestions: (questions: string[]) => void;
  handleBack: () => void;
}> = ({ roomQuestions, setRoomQuestions, handleBack }) => {
  const [questions, setQuestions] = useState([...roomQuestions]);

  const handleChange = (questionIndex: number) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      questions[questionIndex] = e.target.value;
      setQuestions([...questions]);
    };
  };

  const handleDelete = (questionIndex: number) => {
    return () => {
      questions.splice(questionIndex, 1);
      setQuestions([...questions]);
    };
  };

  const handleNew = () => {
    setQuestions([...questions, '']);
  };

  const handleAdd = () => {
    const trimmed = questions.map(s => s.trim());
    if (trimmed.includes('')) return;
    setRoomQuestions([...trimmed]);
    handleBack();
  };

  const handleAddFromPack = () => {
    // TODO
  };

  // would be good to auto focus on new
  const questionList = questions.map((question, index) => {
    return (
      <div key={index}>
        <Typography variant="body1">Qn{index + 1}</Typography>
        <Button size="small" onClick={handleDelete(index)}>
          <Clear />
        </Button>
        <TextField
          error={question.trim() === ''}
          onChange={handleChange(index)}
          value={question}
          helperText={
            question.trim() === ''
              ? 'Your question cannot be blank!'
              : undefined
          }
        />
      </div>
    );
  });

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
      {questionList}
      <Button
        size="small"
        variant="outlined"
        color="primary"
        onClick={handleNew}
      >
        <Add fontSize="small" />
        NEW QUESTION
      </Button>
      <Button variant="contained" color="primary" onClick={handleAdd}>
        ADD QUESTIONS
      </Button>
      <Button color="primary" onClick={handleBack}>
        BACK
      </Button>
    </>
  );
};

export default AddQuestions;
