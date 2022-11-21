import React, { useState } from 'react';
import {
  Button,
  IconButton,
  InputBase,
  InputAdornment,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';

import { ChplTooltip } from 'components/util';
import theme from 'themes/theme';

const useStyles = makeStyles(() => ({
  goButton: {
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

function ChplSearchTerm(props) {
  const { dispatch } = props;
  const [term, setTerm] = useState('');
  const classes = useStyles();

  const handleClear = () => {
    setTerm('');
  };

  const handleGo = () => {
    dispatch({ action: 'search', payload: term });
    setTerm('');
  };

  const handleTerm = (event) => {
    setTerm(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && term.match(/^[0-9A-Z]{15}$/i)) {
      handleGo();
    }
  };

  return (
    <>
      <SearchIcon className={classes.searchIcon} color="primary" fontSize="large" />
      <div className={classes.searchBarContainer}>
        <div className={classes.searchBar}>
          <InputBase
            className={classes.searchInput}
            placeholder="Enter CMS ID"
            value={term}
            onChange={handleTerm}
            onKeyPress={handleKeyPress}
            id="search-term-input"
            inputProps={{ 'aria-label': 'Enter CMS ID' }}
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
            className={classes.goButton}
            size="medium"
            variant="contained"
            color="primary"
            id="search-term-go"
            onClick={handleGo}
            disabled={!term.match(/^[0-9A-Z]{15}$/i)}
          >
            Go
          </Button>
        </div>
      </div>
    </>
  );
}

export default ChplSearchTerm;

ChplSearchTerm.propTypes = {
  dispatch: func.isRequired,
};
