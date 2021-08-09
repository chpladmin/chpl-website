import React, { useState } from 'react';
import {
  Button,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';

import theme from '../../../themes/theme';
import CloseIcon from '@material-ui/icons/Close';
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
     <Button size="medium" variant="contained" color="secondary">
       Chpl Default Filter
      <FilterListIcon className={classes.iconSpacing}
      />
    </Button>
    } 
    />
  );
}

export default ChplDefaultFilter;