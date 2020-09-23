import React from 'react';
import {
  Button,
  Typography,
  TextField,
  Grid,
  makeStyles,
  IconButton,
} from '@material-ui/core';
import { Add, Clear } from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  smallButton: {
    borderRadius: 40,
    width: 'auto',
    marginTop: theme.spacing(1),
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
      <Grid item xs={12} key={index}>
        <Grid container item xs={12}>
          <Grid item xs={6} style={{ textAlign: 'left' }}>
            <Typography variant="body1">Qn {index + 1}</Typography>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <IconButton size="small" onClick={handleDelete(index)}>
              <Clear />
            </IconButton>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <TextField
            error={question.trim() === ''}
            onChange={handleChange(index)}
            value={question}
            fullWidth
            helperText={
              question.trim() === ''
                ? 'Your question cannot be blank!'
                : undefined
            }
          />
        </Grid>
      </Grid>
    );
  });

  return (
    <>
      <Grid container spacing={1} style={{ width: '100%' }}>
        {questionList}
      </Grid>
      <Button
        size="small"
        variant="outlined"
        color="primary"
        onClick={handleNew}
        className={classes.smallButton}
      >
        <Add fontSize="small" />
        NEW QUESTION
      </Button>
    </>
  );
};
export default EditQuestionsList;
