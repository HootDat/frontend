import React, { useState, useEffect, useContext } from 'react';
import {
  Accordion,
  AccordionActions,
  Button,
  AccordionSummary,
  Typography,
  AccordionDetails,
  Paper,
  InputBase,
  IconButton,
  SwipeableDrawer,
  Divider,
  ListItem,
  Checkbox,
} from '@material-ui/core';
import {
  Edit,
  ExpandMore,
  Delete,
  Search,
  Filter,
  FilterList,
} from '@material-ui/icons';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

import {
  CommunityQuestionPack,
  QuestionPackPostData,
  LocalQuestionPack,
  QuestionPack,
} from '../../types/questionPack';
import { Category } from '../../types/category';
import store from '../../utils/store';
import { useHistory } from 'react-router-dom';
import BackButton from '../common/BackButton';
import useOnlineStatus from '../../utils/useOnlineStatus';
import AuthContext from '../login/AuthContext';
import packsAPI from '../../api/packs';
import categoriesAPI from '../../api/categories';

type Filter = {
  name: string;
  categories: Set<string>; // any match
  tab: 'mine' | 'community';
};

type Props = {
  inRoom?: boolean;
  handleAdd?: (questions: string[]) => void;
  handleBack?: () => void;
};

const QuestionPackList: React.FC<Props> = ({
  inRoom,
  handleAdd,
  handleBack,
}) => {
  // should fetching be done in parent?
  // will this component be swapped out? yes, when editing it can be swapped out
  // if it gets swapped out, should it fetch for results again?
  // when adding in game room, yes. When viewing, also yes
  // does the parent ever need to know all the packs?
  // when in game room, no, just the selected pack (edit vs add to room)
  // when in view, also no.
  // then just fetch in this compoennt.

  const authState = useContext(AuthContext);

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

  const handleDeletePack = (pack: LocalQuestionPack) => {
    // TODO use a modal to invoke this function
    if (authState.user === null || !online) {
      store.deleteLocalPack(pack);
      setMyPacks(store.getLocalPacks());
    } else {
      packsAPI
        .deletePack(pack.id)
        .then(
          success => store.deletePack(pack.id),
          failure => {
            if (failure.code === 400) {
              // probably deleted already, so pack
              // does not exist
              store.deletePack(pack.id);
            } else if (failure.code === 401) {
              store.removeLoginState();
              authState.setAuthState({ ...authState, user: null });
              // TODO notify user expired, logout
              // otherwise, network issue? try again later
            }
          }
        )
        .then(() => setMyPacks(store.getLocalPacks()));
    }
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
    >
      <Typography variant="h6">Filter by Categories</Typography>
      <Divider />
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
          {category}
        </ListItem>
      ))}
      <Button color="primary" onClick={handleClearCategoryFilter}>
        Clear
      </Button>
      <Button
        color="primary"
        variant="contained"
        onClick={() => setFilterOpen(false)}
      >
        Close
      </Button>
    </SwipeableDrawer>
  );

  // if in room, only use add to rooom button
  // if mine, allow for edit and delete
  // otherwise, no buttons
  const generatePackAccordion = (pack: QuestionPack) => {
    const localOnly = pack.id < 0;

    const generateActions = () => {
      if (inRoom) {
        return (
          <AccordionActions>
            <Button size="small" onClick={() => handleAdd!(pack.questions)}>
              Add to pack
            </Button>
          </AccordionActions>
        );
      }

      if ((pack as LocalQuestionPack).action === undefined) {
        return;
      }

      return (
        <AccordionActions>
          <Button
            size="small"
            onClick={() => handleDeletePack(pack as LocalQuestionPack)}
          >
            <Delete />
            Delete
          </Button>
          <Button
            size="small"
            onClick={() =>
              history.push(`/packs/${Math.abs(pack.id)}/edit`, {
                localOnly: localOnly,
              })
            }
          >
            <Edit />
            Edit
          </Button>
        </AccordionActions>
      );
    };

    return (
      <Accordion key={pack.id}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls={`pack ${pack.id}`}
          id={`pack ${pack.id}`}
        >
          <Typography variant="body1">{pack.name}</Typography>
          <Typography variant="subtitle2">{pack.owner.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ol>
            {pack.questions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ol>
        </AccordionDetails>
        {generateActions()}
      </Accordion>
    );
  };

  const ownedPackAccordions =
    search.tab !== 'mine'
      ? []
      : myPacks.filter(filter).map(generatePackAccordion);

  const communityPackAccordions =
    search.tab !== 'community'
      ? []
      : communityPacks.filter(filter).map(generatePackAccordion);

  // TODO: if loading, show loading screen, otherwise show content?
  // or maybe if loading, shwo a skeleton instead
  return (
    <>
      {filterDrawer}
      <ToggleButtonGroup
        exclusive
        value={search.tab}
        onChange={handleTabChange}
        aria-label="pack tab"
      >
        <ToggleButton value="community" aria-label="community">
          Community Packs
        </ToggleButton>
        <ToggleButton value="mine" aria-label="mine">
          My Packs
        </ToggleButton>
      </ToggleButtonGroup>
      <Paper>
        <Search />
        <InputBase
          placeholder="Search"
          value={search.name}
          onChange={handleNameSearch}
          inputProps={{
            'aria-label': 'search packs',
          }}
        />
        <IconButton onClick={() => setFilterOpen(true)}>
          <FilterList />
        </IconButton>
      </Paper>
      {search.tab !==
      'community' ? undefined : communityPackAccordions.length === 0 ? (
        <Typography variant="h5">No results were found :(</Typography>
      ) : (
        communityPackAccordions
      )}
      {search.tab !== 'mine' ? undefined : ownedPackAccordions.length === 0 ? (
        <Typography variant="h5">No results were found :(</Typography>
      ) : (
        ownedPackAccordions
      )}
      {inRoom && <BackButton handleBack={handleBack!} />}
    </>
  );
};

export default QuestionPackList;
