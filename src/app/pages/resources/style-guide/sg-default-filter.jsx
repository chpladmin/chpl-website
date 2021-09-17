import React from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';

import SgDefaultFilterPopover from './sg-default-filter-popover';
import FilterListIcon from '@material-ui/icons/FilterList';

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
});

function SgDefaultFilter() {
  const classes = useStyles();

  return (
    <SgDefaultFilterPopover
    anchor={
     <Button variant="contained" color="secondary">
       Chpl Default Filter
      <FilterListIcon className={classes.iconSpacing}
      />
    </Button>
    } 
    />
  );
}

export default SgDefaultFilter;