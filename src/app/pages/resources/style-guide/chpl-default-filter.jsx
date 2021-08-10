import React from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';

import ChplDefaultFilterPopover from './chpl-default-filter-popover';
import FilterListIcon from '@material-ui/icons/FilterList';

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
});

function ChplDefaultFilter() {
  const classes = useStyles();

  return (
    <ChplDefaultFilterPopover
    anchor={
     <Button size="medium" variant="outlined" color="default">
       Chpl Default Filter
      <FilterListIcon className={classes.iconSpacing}
      />
    </Button>
    } 
    />
  );
}

export default ChplDefaultFilter;