import React from 'react';
import {
  Box,
  makeStyles,
} from '@material-ui/core';
import { bool } from 'prop-types';

import ChplFilterPanel from './filter-panel';
import ChplFilterQuickFilters from './filter-quick-filters';
import ChplFilterSearchTerm from './filter-search-term';

import { palette, theme } from 'themes';

const useStyles = makeStyles({
  searchContainer: {
    backgroundColor: palette.grey,
    padding: '16px 32px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr auto',
    },
  },
  searchButtonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gridGap: '8px',
  },
});

function ChplFilterSearchBar({ hideAdvancedSearch, hideQuickFilters }) {
  const classes = useStyles();

  return (
    <div className={classes.searchContainer}>
      <ChplFilterSearchTerm />
      <Box className={classes.searchButtonContainer}>
        { !hideAdvancedSearch
          && (
            <ChplFilterPanel />
          )}
        { !hideQuickFilters
          && (
            <ChplFilterQuickFilters />
          )}
      </Box>
    </div>
  );
}

export default ChplFilterSearchBar;

ChplFilterSearchBar.propTypes = {
  hideAdvancedSearch: bool,
  hideQuickFilters: bool,
};

ChplFilterSearchBar.defaultProps = {
  hideAdvancedSearch: false,
  hideQuickFilters: false, // replace this with "does quick filters" exist in context
};
