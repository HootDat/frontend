import React, { useState, useEffect } from 'react';
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
} from '@material-ui/core';
import { Edit, ExpandMore, Delete } from '@material-ui/icons';
import { TabContext, TabPanel, TabList } from '@material-ui/lab';

import { QuestionPack, QuestionPackPostData } from '../../types/questionPack';
import { Category } from '../../types/category';
import store from '../../utils/store';

type Filter = {
  name: string;
  categories: string[]; // any match
  tab: 'mine' | 'community';
};

const QuestionPackList: React.FC = () => {
  // should fetching be done in parent?
  // will this component be swapped out? yes, when editing it can be swapped out
  // if it gets swapped out, should it fetch for results again?
  // when adding in game room, yes. When viewing, also yes
  // does the parent ever need to know all the packs?
  // when in game room, no, just the selected pack (edit vs add to room)
  // when in view, also no.
  // then just fetch in this compoennt.

  const [communityPacks, setCommunityPacks] = useState([] as QuestionPack[]);
  const [myPacks, setMyPacks] = useState([] as QuestionPack[]);
  const [categories, setCategories] = useState([] as Category[]);
  const [search, setSearch] = useState<Filter>({
    name: '',
    categories: [],
    tab: 'mine', // TODO: Maybe it would be good to see community first? only see mine first if in room
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      // packsAPI.getPacks().then(setPacks),
      // categoriesAPI.getCategories().then(setCategories),
      // when we fetch, we filter my own ones and merge with local store as necessary
    ]).finally(() => setIsLoading(false));
  }, []);

  const handleNameSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch({ ...search, name: e.target.value });
  };

  const handleTabChange = (
    e: React.ChangeEvent<{}>,
    tab: 'mine' | 'community'
  ) => {
    setSearch({ ...search, tab: tab });
  };

  const filter = (pack: QuestionPackPostData) =>
    pack.name.includes(search.name) &&
    (search.categories.length === 0 ||
      pack.categories.some(search.categories.includes));

  const generatePackAccordion = (pack: QuestionPack) => {
    return (
      <Accordion key={pack.id}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls={`pack ${pack.id}`}
          id={`pack ${pack.id}`}
        >
          <Typography>{pack.name}</Typography>
          <Typography>{pack.owner.name}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ol>
            {pack.questions.map((question, index) => (
              <li key={index}>{question}</li>
            ))}
          </ol>
        </AccordionDetails>
        <AccordionActions>
          <Button size="small">
            <Delete />
            Delete
          </Button>
          <Button size="small">
            <Edit />
            Edit
          </Button>
        </AccordionActions>
      </Accordion>
    );
  };

  const ownedPackAccordions =
    search.tab !== 'mine'
      ? undefined
      : store.getLocalPacks().filter(filter).map(generatePackAccordion);

  const communityPackAccordions =
    search.tab !== 'community'
      ? undefined
      : communityPacks.filter(filter).map(generatePackAccordion);

  // TODO: if loading, show loading screen, otherwise show content?
  // or maybe if loading, shwo a skeleton instead
  return (
    <Box>
      {/* Search */}
      <TextField
        placeholder="Search..."
        value={search.name}
        onChange={handleNameSearch}
      />
      <TabContext value={search.tab}>
        <AppBar position="static">
          <TabList
            variant="fullWidth"
            aria-label="packs tab"
            onChange={handleTabChange}
          >
            <Tab label="Mine" value="mine" />
            <Tab label="Community" value="community" />
          </TabList>
        </AppBar>
        <TabPanel value="mine">{ownedPackAccordions}</TabPanel>
        <TabPanel value="community">{communityPackAccordions}</TabPanel>
      </TabContext>
    </Box>
  );
};

export default QuestionPackList;
