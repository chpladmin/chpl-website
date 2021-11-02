import React, { useState } from 'react';
import {
  Button,
  InputBase,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';

import { useFilterContext } from './filter-context';

const useStyles = makeStyles(() => ({
}));

function ChplFilterSearchTerm(props) {
  const { placeholder } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const classes = useStyles();

  const filterContext = useFilterContext();

  const handleGo = () => {
    filterContext.setSearchTerm(searchTerm);
  }

  const handleSearchTerm = (event) => {
    setSearchTerm(event.target.value);
  }

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
          />
          <Button
            className={classes.goButton}
            size="medium"
            variant="contained"
            color="primary"
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
