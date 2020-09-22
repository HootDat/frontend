import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Tab,
  TextField,
  AppBar,
  Accordion,
  AccordionActions,
  Button,
  AccordionSummary,
  Typography,
  AccordionDetails,
  InputAdornment,
} from '@material-ui/core';
import { Edit, ExpandMore, Delete, Search } from '@material-ui/icons';
import {
  TabContext,
  TabPanel,
  TabList,
  ToggleButton,
  ToggleButtonGroup,
} from '@material-ui/lab';

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
  categories: string[]; // any match
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

  const { name } = useContext(AuthContext);

  const [communityPacks, setCommunityPacks] = useState(
    [] as CommunityQuestionPack[]
  );
  const [myPacks, setMyPacks] = useState(store.getLocalPacks());
  const [categories, setCategories] = useState([] as Category[]);
  const [search, setSearch] = useState<Filter>({
    name: '',
    categories: [],
    tab: 'mine', // TODO: Maybe it would be good to see community first? only see mine first if in room
  });
  const history = useHistory();
  const online = useOnlineStatus();

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
    if (name === null || !online) {
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
            }
            // otherwise, network issue? try again later
          }
        )
        .then(() => setMyPacks(store.getLocalPacks()));
    }
  };

  const filter = (pack: QuestionPackPostData) =>
    pack.name.includes(search.name) &&
    (search.categories.length === 0 ||
      pack.categories.some(search.categories.includes));

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
          {/*TODO <Typography variant="subtitle2">{pack.owner.name}</Typography>*/}
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
      ? undefined
      : myPacks.filter(filter).map(generatePackAccordion);

  const communityPackAccordions =
    search.tab !== 'community'
      ? undefined
      : communityPacks.filter(filter).map(generatePackAccordion);

  // TODO: if loading, show loading screen, otherwise show content?
  // or maybe if loading, shwo a skeleton instead
  return (
    <Box>
      <TextField
        placeholder="Search..."
        value={search.name}
        onChange={handleNameSearch}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />
      <ToggleButtonGroup
        exclusive
        value={search.tab}
        onChange={handleTabChange}
        aria-label="pack tab"
      >
        <ToggleButton value="mine" aria-label="mine">
          Mine
        </ToggleButton>
        <ToggleButton value="community" aria-label="community">
          Community
        </ToggleButton>
      </ToggleButtonGroup>
      {search.tab === 'mine' && ownedPackAccordions}
      {search.tab === 'community' && communityPackAccordions}
      {inRoom && <BackButton handleBack={handleBack!} />}
    </Box>
  );
};

export default QuestionPackList;
