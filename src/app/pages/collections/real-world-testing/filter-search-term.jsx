import React, { useState } from 'react';
import {
  Button,
  InputBase,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';

import { useFilterContext } from './filter-context';
import theme from '../../../themes/theme';

const useStyles = makeStyles(() => ({
  goButton: {
    margin: '-8px',
    borderRadius: '0px 8px 8px 0px',
  },
  searchBar: {
    display: 'grid',
    gridTemplateColumns: '10fr auto',
  },
  searchIcon: {
    display:'none',
    [theme.breakpoints.up('md')]: {
      display:'grid',
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
  const { placeholder } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const classes = useStyles();

  const filterContext = useFilterContext();

  const handleGo = () => {
    filterContext.setSearchTerm(searchTerm);
  };

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <SearchIcon className={classes.searchIcon} color="primary" fontSize="large" />
      <div className={classes.searchBarContainer}>
        <div className={classes.searchBar}>
          <InputBase
            className={classes.searchInput}
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearchTerm}
            id="filter-search-term-input"
          />
          <Button
            className={classes.goButton}
            size="medium"
            variant="contained"
            color="primary"
            id="filter-search-term-go"
            onClick={handleGo}
          >
            Go
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
