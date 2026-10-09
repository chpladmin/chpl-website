import React, { useEffect, useState } from 'react';
import {
  Box, Button, IconButton, InputAdornment, InputBase,
} from '@mui/material';
import { string } from 'prop-types';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import { useFilterContext } from './filter-context';

import { ChplTooltip } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { palette, theme } from 'themes';

const styles = {
  searchButton: {
    margin: '-8px',
    borderRadius: '0 8px 8px 0',
    color: palette.white,
  },
  searchBar: {
    display: 'grid',
    gridTemplateColumns: '8fr auto',
  },
  searchIcon: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
    },
  },
  searchInput: {
    flexGrow: 1,
  },
  searchBarContainer: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: '8px',
    borderRadius: '8px',
  },
};

function ChplFilterSearchTerm({ placeholder = 'Search by Developer, Product, or CHPL ID...' }) {
  const [term, setTerm] = useState('');

  const {
    analytics,
    dispatch,
    searchTerm,
    setSearchTerm,
  } = useFilterContext();

  useEffect(() => {
    setTerm(decodeURI(searchTerm));
  }, [searchTerm]);

  const handleClear = () => {
    if (analytics) {
      eventTrack({
        ...analytics,
        event: 'Clear Free Text Filter',
      });
    }
    setTerm('');
    setSearchTerm('');
  };

  const handleSearch = () => {
    if (analytics) {
      eventTrack({
        ...analytics,
        event: 'Search for Free Text',
        label: term,
      });
    }
    setSearchTerm(encodeURI(term));
    dispatch('hasSearched');
  };

  const handleTerm = (event) => {
    setTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return <>
    <Box sx={styles.searchBarContainer}>
      <Box sx={styles.searchBar}>
        <InputBase
          sx={styles.searchInput}
          placeholder={placeholder}
          value={term}
          onChange={handleTerm}
          onKeyPress={handleKeyPress}
          id="filter-search-term-input"
          inputProps={{ 'aria-label': 'Search by Developer, Product, or CHPL ID' }}
          endAdornment={(
            <InputAdornment position="start">
              <ChplTooltip title="Clear">
                <IconButton onClick={handleClear} aria-label="Clear search" size="large">
                  <ClearIcon />
                </IconButton>
              </ChplTooltip>
            </InputAdornment>
          )}
        />
        <Button
          sx={styles.searchButton}
          size="medium"
          variant="contained"
          color="primary"
          id="filter-search-term-search"
          onClick={handleSearch}
          endIcon={<SearchIcon sx={styles.searchIcon} color="inherit" fontSize="large" />}
        >
          Search
        </Button>
      </Box>
    </Box>
  </>;
}

export default ChplFilterSearchTerm;

ChplFilterSearchTerm.propTypes = {
  placeholder: string,
};
