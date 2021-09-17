import React from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';

import SgAdvancedSearchPopover from './sg-advanced-search-popover';
import FilterListIcon from '@material-ui/icons/FilterList';

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
});

function SgAdvancedSearch() {
  const classes = useStyles();

  return (
    <SgAdvancedSearchPopover
      anchor={
        <Button color="primary">
          Advanced Search
          <FilterListIcon className={classes.iconSpacing}
          />
        </Button>
      }
    />
  );
}

export default SgAdvancedSearch;