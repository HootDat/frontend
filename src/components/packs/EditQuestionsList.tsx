import React from 'react';
import { Button, Typography, TextField } from '@material-ui/core';
import { Add, Clear } from '@material-ui/icons';

const EditQuestionsList: React.FC<{
  questions: string[];
  setQuestions: (questions: string[]) => void;
}> = ({ questions, setQuestions }) => {
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
    </>
  );
};
export default EditQuestionsList;
