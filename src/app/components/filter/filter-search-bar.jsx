import React from 'react';
import {
  Box,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf,
  bool,
  object,
  string,
} from 'prop-types';

import ChplFilterBrowse from './filter-browse';
import ChplFilterPanel from './filter-panel';
import ChplFilterQuickFilters from './filter-quick-filters';
import ChplFilterSearchTerm from './filter-search-term';
import { useFilterContext } from './filter-context';

import { palette, theme } from 'themes';

const useStyles = makeStyles({
  searchContainer: {
    backgroundColor: palette.grey,
    padding: '16px 32px',
    display: 'grid',
    borderRadius: '8px',
    gridTemplateColumns: '1fr',
    gap: '16px',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      padding: '16px',
    },
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '1fr auto',
    },
  },
  searchButtonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gridGap: '8px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      width: '100%',
      '& > *': {
        flex: '0 0 auto',
      },
    },
  },
  sticky: {
    position: 'sticky',
    top: 0,
    zIndex: 2,
  },
});

function ChplFilterSearchBar({
  hideAdvancedSearch = false,
  hideSearchTerm = false,
  placeholder = 'Search by Developer, Product, or CHPL ID...',
  sticky = false,
  toggleMultipleFilters = undefined,
}) {
  const { filters } = useFilterContext();
  const classes = useStyles();

  return (
    <div
      className={sticky ? `${classes.searchContainer} ${classes.sticky}` : classes.searchContainer}
      data-filter-search-bar="true"
    >
      { !hideSearchTerm
        && (
          <ChplFilterSearchTerm
            placeholder={placeholder}
          />
        )}
      <Box className={classes.searchButtonContainer}>
        <ChplFilterBrowse />
        { !hideAdvancedSearch
          && (
            <ChplFilterPanel />
          )}
        { filters.some((f) => f.key === 'quickFilters')
          && (
            <ChplFilterQuickFilters
              toggleMultipleFilters={toggleMultipleFilters}
            />
          )}
      </Box>
    </div>
  );
}

export default ChplFilterSearchBar;

ChplFilterSearchBar.propTypes = {
  hideAdvancedSearch: bool,
  hideSearchTerm: bool,
  placeholder: string,
  sticky: bool,
  toggleMultipleFilters: arrayOf(object),
};
