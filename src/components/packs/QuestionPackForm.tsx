import {
  Chip,
  FormControlLabel,
  makeStyles,
  Switch,
  TextField,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Category } from '../../types/category';
import { LocalQuestionPack } from '../../types/questionPack';
import ActionButton from '../common/ActionButton';
import BackButton from '../common/BackButton';
import EditQuestionsList from './EditQuestionsList';

const INVALID_ID = 0;

const useStyles = makeStyles(theme => ({
  buttonGroup: {
    position: 'absolute',
    width: '100%',
    bottom: '0px',
    textAlign: 'center',
  },
  button: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  container: {
    overflow: 'auto',
    marginTop: theme.spacing(2),
    textAlign: 'center',
  },
  root: {
    height: 'calc(100% - 168px)',
    display: 'flex',
    flexFlow: 'column',
  },
}));

// TODO ensure invalid question packs cannot be submitted
const QuestionPackForm: React.FC<{
  handleSubmit: (pack: LocalQuestionPack) => void;
  editPack?: LocalQuestionPack;
  categories: Category[]; // should be fetched in parent
}> = ({
  handleSubmit,
  editPack = {
    name: '',
    questions: [''],
    categories: [],
    public: false,
    action: 'new',
    // these are placeholders, which will be overwritten in local storage
    id: INVALID_ID,
    updatedAt: '',
    owner: { id: INVALID_ID, name: '' },
  } as LocalQuestionPack,
  categories,
}) => {
  const [pack, setPack] = useState<LocalQuestionPack>(editPack);
  const [tempCategory, setTempCategory] = useState('');

  const history = useHistory();
  const classes = useStyles();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPack({ ...pack, name: e.target.value });
  };

  const handleSetQuestions = (questions: string[]) => {
    setPack({ ...pack, questions: questions });
  };

  // TODO if enter is not pressed in categories, the input won't get captured
  const handleCategoriesChange = (
    e: React.ChangeEvent<{}>,
    categories: string[],
    reason: string
  ) => {
    setPack({ ...pack, categories: categories });
  };

  const handleSave = () => {
    if (tempCategory.trim() !== '') {
      pack.categories.push(tempCategory.trim());
    }
    handleSubmit(pack);
  };

  const handlePublicChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPack({ ...pack, public: event.target.checked });
  };

  const disableButton =
    pack.name.trim() === '' ||
    pack.questions.some(question => question.trim() === '') ||
    pack.questions.length === 0;

  return (
    <div className={classes.root}>
      <TextField
        label="Pack name"
        error={pack.name.trim() === ''}
        helperText={pack.name.trim() === '' ? 'Pack name cannot be blank!' : ''}
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
          <TextField
            {...params}
            label="Categories"
            placeholder="e.g. Fun"
            value={tempCategory}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTempCategory(e.target.value)
            }
          />
        )}
      />

      <div className={classes.container}>
        <EditQuestionsList
          questions={pack.questions}
          setQuestions={handleSetQuestions}
        />
      </div>
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
      <div className={classes.buttonGroup}>
        <ActionButton
          variant="contained"
          color="primary"
          disabled={disableButton}
          onClick={handleSave}
          className={classes.button}
        >
          {pack.id === INVALID_ID ? 'CREATE PACK' : 'SAVE PACK'}
        </ActionButton>
        <BackButton
          text="back to packs"
          handleBack={() => history.push('/packs')}
          className={classes.button}
        />
      </div>
    </div>
  );
};

export default QuestionPackForm;
