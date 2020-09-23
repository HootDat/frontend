import React from 'react';
import { Button, Typography, TextField, Grid, makeStyles } from '@material-ui/core';
import { Add, Clear } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  questionFill: {
    width:'100%',
  },
}));


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

  const classes = useStyles();

  // TODO would be good to ensure questions are all unique
  // would be good to auto focus on new
  const questionList = questions.map((question, index) => {
    return (
      <div key={index}>
        <Grid item xs={12}>
          <Typography variant="body1">Qn {index + 1}</Typography>
          <Button size="small" onClick={handleDelete(index)}>
            <Clear />
          </Button>
        </Grid>
        <TextField
          error={question.trim() === ''}
          onChange={handleChange(index)}
          value={question}
          helperText={
            question.trim() === ''
              ? 'Your question cannot be blank!'
              : undefined
          }
          className = {classes.questionFill}
        />
      </div>
    );
  });

  return (
    <>
      <Grid item xs={12}>
        {questionList}
      </Grid>
      <Button
        size="small"
        variant="outlined"
        color="primary"
        onClick={handleNew}
        style={
          {borderRadius:40,
            width: 'auto'
          }
        }
      >
        <Add fontSize="small" />
        NEW QUESTION
      </Button>
    </>
  );
};
export default EditQuestionsList;
