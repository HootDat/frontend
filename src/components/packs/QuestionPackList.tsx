import {
  Button,
  Checkbox,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Paper,
  SwipeableDrawer,
  Typography,
} from '@material-ui/core';
import {
  Add,
  Delete,
  Edit,
  Filter,
  FilterList,
  Search,
} from '@material-ui/icons';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import categoriesAPI from '../../api/categories';
import packsAPI from '../../api/packs';
import { ApiErrorResponse } from '../../types/api';
import { Category } from '../../types/category';
import {
  CommunityQuestionPack,
  LocalQuestionPack,
  QuestionPack,
  QuestionPackPostData,
} from '../../types/questionPack';
import store from '../../utils/store';
import useOnlineStatus from '../../utils/useOnlineStatus';
import BackButton from '../common/BackButton';
import PushNotification from '../common/notification/PushNotification';
import AuthContext from '../login/AuthContext';

const useStyles = makeStyles(theme => ({
  searchBar: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  packList: {
    height: 'calc(100% - 128px)',
    overflow: 'auto',
    marginTop: theme.spacing(2),
  },
  padding: {
    margin: theme.spacing(1),
  },
  drawerList: {
    maxWidth: '250px',
    height: 'calc(100% - 110px)',
    overflow: 'auto',
  },
  filterButtons: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    position: 'absolute',
    bottom: '0px',
    paddingTop: theme.spacing(1),
  },
  text: {
    wordWrap: 'break-word',
  },
  iconButtonRight: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
  iconButtonLeft: {
    position: 'absolute',
    left: theme.spacing(1),
    top: theme.spacing(1),
  },
  individualContainer: {
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
  },
}));

type Filter = {
  name: string;
  categories: Set<string>; // any match
  tab: 'mine' | 'community';
};

type Props = {
  inRoom?: boolean;
  handleAdd?: (questions: string[]) => void;
  hideOutsideContent?: (hide: boolean) => void;
};

// TODO need to fetch more often. After deleting/editing/creating,
// the community packs arent updated
const QuestionPackList: React.FC<Props> = ({
  inRoom,
  handleAdd,
  hideOutsideContent = () => {},
}) => {
  // should fetching be done in parent?
  // will this component be swapped out? yes, when editing it can be swapped out
  // if it gets swapped out, should it fetch for results again?
  // when adding in game room, yes. When viewing, also yes
  // does the parent ever need to know all the packs?
  // when in game room, no, just the selected pack (edit vs add to room)
  // when in view, also no.
  // then just fetch in this compoennt.
  const classes = useStyles();

  const authState = useContext(AuthContext);
  const pushNotif = useContext(PushNotification);

  const [communityPacks, setCommunityPacks] = useState(
    [] as CommunityQuestionPack[]
  );
  const [myPacks, setMyPacks] = useState(store.getLocalPacks());
  const [categories, setCategories] = useState([] as Category[]);
  const [filterOpen, setFilterOpen] = useState(false);
  const online = useOnlineStatus();
  const [search, setSearch] = useState<Filter>({
    name: '',
    categories: new Set(),
    tab: 'mine',
  });
  const [viewingPack, setViewingPack] = useState<QuestionPack | null>(null);
  const history = useHistory();

  useEffect(() => {
    const setLocalCategories = () => setCategories(store.getCategories());
    if (!online) {
      setLocalCategories();
      return;
    }

    // TODO add pagination
    packsAPI.getPacks().then(setCommunityPacks, () => {});
    categoriesAPI
      .getCategories()
      .then(
        categories => setCategories([...categories, ...store.getCategories()]),
        setLocalCategories
      );
    // TODO when we fetch, we filter my own ones and merge with local store as necessary
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNameSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch({ ...search, name: e.target.value });
  };

  const handleTabChange = (
    e: React.ChangeEvent<{}>,
    tab: 'mine' | 'community'
  ) => {
    if (tab !== null) {
      setSearch({ ...search, tab: tab });
    }
  };

  const handleDeletePack = async (pack: LocalQuestionPack) => {
    // TODO use a modal to invoke this function
    if (authState.user === null || !online) {
      store.deleteLocalPack(pack);
      setMyPacks(store.getLocalPacks());
      return;
    }

    try {
      await packsAPI.deletePack(pack.id);
      store.deletePack(pack.id);
    } catch (error) {
      const apiError = error as ApiErrorResponse;
      if (apiError.code === 401) {
        store.removeLoginState();
        authState.setAuthState({ ...authState, user: null });
        pushNotif({
          message: 'Log in expired, please log in again',
          severity: 'error',
        });
        history.push('/login');
        return;
      }
      if (apiError.code === 403) {
        pushNotif({
          message: apiError.body?.error || 'Permission denied',
          severity: 'error',
        });
        return;
      }
      if (apiError.code === 400) {
        // probably deleted already, so pack does not exist
        pushNotif({
          message: apiError.body?.error || 'Something went wrong',
          severity: 'warning',
        });
        store.deletePack(pack.id);
      } else {
        // network issue? try again later
        pushNotif({
          message: "The server is unreachable now, we'll try again later",
          severity: 'warning',
        });
        store.deleteLocalPack(pack);
      }
    }
    setMyPacks(store.getLocalPacks());
    setViewingPack(null);
    hideOutsideContent(false);
  };

  const handleClearCategoryFilter = () => {
    setSearch({ ...search, categories: new Set() });
  };

  const filter = (pack: QuestionPackPostData) =>
    pack.name.includes(search.name) &&
    (search.categories.size === 0 ||
      pack.categories.some(category => search.categories.has(category)));

  const handleEditCategoryFilter = (category: string) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let categories;
    if (event.target.checked) {
      categories = new Set(search.categories);
      categories.add(category);
    } else {
      categories = new Set(search.categories);
      categories.delete(category);
    }
    setSearch({ ...search, categories: categories });
  };

  // filter applies even without pressing apply
  const filterDrawer = (
    <SwipeableDrawer
      anchor="left"
      open={filterOpen}
      onClose={() => setFilterOpen(false)}
      onOpen={() => setFilterOpen(true)}
      style={{ textAlign: 'left' }}
    >
      <span style={{ padding: '4px 8px' }}>
        <Typography variant="h6">Filter by Categories</Typography>
      </span>
      <Divider />
      <List className={classes.drawerList}>
        {categories.sort().map(category => (
          <ListItem key={category}>
            <Checkbox
              color="primary"
              checked={search.categories.has(category)}
              value={category}
              onChange={handleEditCategoryFilter(category)}
              inputProps={{
                'aria-label': `${category}-filter`,
              }}
            />
            <ListItemText
              primary={category}
              style={{ wordWrap: 'break-word' }}
            />
          </ListItem>
        ))}
      </List>
      <div className={classes.filterButtons}>
        <Button color="primary" fullWidth onClick={handleClearCategoryFilter}>
          Clear
        </Button>
        <Button
          color="primary"
          fullWidth
          variant="contained"
          onClick={() => setFilterOpen(false)}
        >
          Close
        </Button>
      </div>
    </SwipeableDrawer>
  );

  // if in room, only use add to rooom button
  // if mine, allow for edit and delete
  // otherwise, no buttons
  const individualPackScreen = () => {
    if (viewingPack === null) return <></>;
    const generateAction = () => {
      if (inRoom) {
        // TODO if we remove chat shell, change this back to right
        return (
          <Button
            onClick={() => handleAdd!(viewingPack.questions)}
            className={classes.iconButtonLeft}
          >
            <Add />
            Add to room
          </Button>
        );
      }

      if ((viewingPack as LocalQuestionPack).action === undefined) return;

      return (
        <IconButton
          onClick={() => handleDeletePack(viewingPack as LocalQuestionPack)}
          className={classes.iconButtonRight}
        >
          <Delete />
        </IconButton>
      );
    };

    return (
      <>
        {generateAction()}
        <div
          className={classes.individualContainer}
          style={inRoom ? {} : { paddingTop: '40px' }}
        >
          <Typography variant="h5" className={classes.text}>
            {viewingPack!.name}
          </Typography>
          <Typography variant="h6" align="left" className={classes.text}>
            Owner: {viewingPack!.owner.name}
          </Typography>
          <Typography variant="h6" align="left" className={classes.text}>
            Categories: {viewingPack!.categories.sort().join(', ')}
          </Typography>
          <Typography variant="h6" align="center">
            Questions
          </Typography>
          <Paper style={{ overflow: 'auto' }}>
            <List dense>
              {viewingPack!.questions.map((question, index) => (
                <ListItem key={question}>
                  <ListItemText primary={`Q${index + 1}. ${question}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </div>
        <div className={classes.button}>
          <BackButton
            text="Back to Packs"
            handleBack={() => {
              setViewingPack(null);
              hideOutsideContent(false);
            }}
          />
        </div>
      </>
    );
  };

  const packList = (packs: QuestionPack[]) => {
    const actionButton = (pack: QuestionPack) => {
      const localOnly = pack.id < 0;
      if (inRoom) {
        return (
          <Button size="small" onClick={() => handleAdd!(pack.questions)}>
            <Add />
            Add
          </Button>
        );
      }

      if ((pack as LocalQuestionPack).action === undefined) {
        return;
      }

      return (
        <IconButton
          size="small"
          onClick={() =>
            history.push(`/packs/${Math.abs(pack.id)}/edit`, {
              localOnly: localOnly,
            })
          }
        >
          <Edit />
        </IconButton>
      );
    };

    return packs.map(pack => (
      <ListItem
        key={pack.id}
        onClick={() => {
          setViewingPack(pack);
          hideOutsideContent(true);
        }}
        style={{ height: '30' }}
      >
        <ListItemText
          primary={pack.name}
          primaryTypographyProps={{ noWrap: true }}
          secondary={pack.owner.name}
          secondaryTypographyProps={{ noWrap: true }}
        />
        <ListItemSecondaryAction>{actionButton(pack)}</ListItemSecondaryAction>
      </ListItem>
    ));
  };

  const ownedPackAccordions =
    search.tab !== 'mine' ? [] : packList(myPacks.filter(filter));

  const communityPackAccordions =
    search.tab !== 'community' ? [] : packList(communityPacks.filter(filter));

  // TODO: if loading, show loading screen, otherwise show content?
  // or maybe if loading, shwo a skeleton instead
  return viewingPack !== null ? (
    individualPackScreen()
  ) : (
    <>
      {filterDrawer}
      <ToggleButtonGroup
        exclusive
        value={search.tab}
        onChange={handleTabChange}
        aria-label="pack tab"
        className={classes.padding}
      >
        <ToggleButton value="community" aria-label="community">
          Community Packs
        </ToggleButton>
        <ToggleButton value="mine" aria-label="mine">
          My Packs
        </ToggleButton>
      </ToggleButtonGroup>
      <Paper elevation={3} className={classes.searchBar}>
        <InputBase
          placeholder="Search"
          value={search.name}
          onChange={handleNameSearch}
          startAdornment={<Search />}
          inputProps={{
            'aria-label': 'search packs',
          }}
          style={{ flex: 1 }}
        />
        <IconButton
          onClick={() => setFilterOpen(true)}
          style={{ padding: '10px' }}
        >
          <FilterList />
        </IconButton>
      </Paper>
      <Paper className={classes.packList}>
        <List dense>
          {search.tab !==
          'community' ? undefined : communityPackAccordions.length === 0 ? (
            <Typography variant="h5">No results were found :(</Typography>
          ) : (
            communityPackAccordions
          )}
          {search.tab !== 'mine' ? undefined : ownedPackAccordions.length ===
            0 ? (
            <Typography variant="h5">No results were found :(</Typography>
          ) : (
            ownedPackAccordions
          )}
        </List>
      </Paper>
    </>
  );
};

export default QuestionPackList;
