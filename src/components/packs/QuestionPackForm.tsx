import React, { useState } from 'react';
import {
  TextField,
  Button,
  Chip,
  FormControlLabel,
  Switch,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import EditQuestionsList from './EditQuestionsList';
import { useHistory } from 'react-router-dom';
import { QuestionPackPostData } from '../../types/questionPack';
import { Category } from '../../types/category';

const QuestionPackForm: React.FC<{
  handleSubmit: (pack: QuestionPackPostData) => void;
  editPack?: QuestionPackPostData;
  categories: Category[]; // should be fetched in parent
}> = ({
  handleSubmit,
  editPack = {
    id: 0, // invalid id for new pack
    name: '',
    questions: [''],
    categories: [],
    public: false,
  } as QuestionPackPostData,
  categories,
}) => {
  const [pack, setPack] = useState<QuestionPackPostData>(editPack);

  const history = useHistory();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPack({ ...pack, name: e.target.value });
  };

  const handleSetQuestions = (questions: string[]) => {
    setPack({ ...pack, questions: questions });
  };

  const handleCategoriesChange = (
    e: React.ChangeEvent<{}>,
    categories: string[],
    reason: string
  ) => {
    setPack({ ...pack, categories: categories });
  };

  const handlePublicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPack({ ...pack, public: event.target.checked });
  };

  return (
    <>
      <TextField
        label="Pack name"
        value={pack.name}
        onChange={handleNameChange}
      />
      <Autocomplete
        multiple
        id="categories"
        options={categories}
        value={pack.categories}
        onChange={handleCategoriesChange}
        freeSolo
        renderTags={(categories: string[], getTagProps) =>
          categories.map((category, index) => (
            <Chip
              key={index}
              variant="outlined"
              label={category}
              {...getTagProps({ index })}
            />
          ))
        }
        renderInput={params => (
          <TextField {...params} label="Categories" placeholder="e.g. Fun" />
        )}
      />

      <EditQuestionsList
        questions={pack.questions}
        setQuestions={handleSetQuestions}
      />
      <FormControlLabel
        control={
          <Switch
            checked={pack.public}
            onChange={handlePublicChange}
            name="public"
          />
        }
        label={pack.public ? 'Public' : 'Private'}
      />
      <Button
        variant="contained"
        color="primary"
        disabled={pack.questions.length === 0}
        onClick={() => handleSubmit(pack)}
      >
        CREATE PACK
      </Button>
      <Button color="primary" onClick={() => history.push('/packs')}>
        BACK
      </Button>
    </>
  );
};

export default QuestionPackForm;
