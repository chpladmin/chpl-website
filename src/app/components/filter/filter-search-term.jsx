import React, { useEffect, useState } from 'react';
import {
  Button,
  IconButton,
  InputBase,
  InputAdornment,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import { useFilterContext } from './filter-context';

import { ChplTooltip } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import theme from 'themes/theme';

const useStyles = makeStyles(() => ({
  searchButton: {
    margin: '-8px',
    borderRadius: '0 8px 8px 0',
  },
  searchBar: {
    display: 'grid',
    gridTemplateColumns: '10fr auto',
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
}));

function ChplFilterSearchTerm(props) {
  const $analytics = getAngularService('$analytics');
  const { placeholder } = props;
  const [term, setTerm] = useState('');
  const classes = useStyles();

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
      $analytics.eventTrack('Clear Text Filter', { category: analytics.category });
    }
    setTerm('');
    setSearchTerm('');
  };

  const handleSearch = () => {
    if (analytics) {
      $analytics.eventTrack('Enter Value Into Text Filter', { category: analytics.category, label: term });
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

  return (
    <>
      <div className={classes.searchBarContainer}>
        <div className={classes.searchBar}>
          <InputBase
            className={classes.searchInput}
            placeholder={placeholder}
            value={term}
            onChange={handleTerm}
            onKeyPress={handleKeyPress}
            id="filter-search-term-input"
            inputProps={{ 'aria-label': 'Search by Developer, Product, or CHPL ID' }}
            endAdornment={(
              <InputAdornment position="start">
                <ChplTooltip title="Clear">
                  <IconButton
                    onClick={handleClear}
                    aria-label="Clear search"
                  >
                    <ClearIcon />
                  </IconButton>
                </ChplTooltip>
              </InputAdornment>
            )}
          />
          <Button
            className={classes.searchButton}
            size="medium"
            variant="contained"
            color="primary"
            id="filter-search-term-search"
            onClick={handleSearch}
          >
            Search
            <SearchIcon className={classes.searchIcon} color="primary" fontSize="large" />
          </Button>
        </div>
      </div>
    </>
  );
}

export default ChplFilterSearchTerm;

ChplFilterSearchTerm.propTypes = {
  placeholder: string,
};

ChplFilterSearchTerm.defaultProps = {
  placeholder: 'Search by Developer, Product, or CHPL ID...',
};
