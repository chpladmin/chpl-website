import React from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';

import { useFilterContext } from './filter-context';

const useStyles = makeStyles({
  browseButton: {
    borderRadius: '8px',
  },
});

function ChplFilterBrowse() {
  const classes = useStyles();

  const {
    dispatch,
    setSearchTerm,
  } = useFilterContext();

  const handleBrowse = () => {
    setSearchTerm('');
    dispatch('resetAll');
    dispatch('hasSearched');
  };

  return (
    <Button
      className={classes.browseButton}
      size="medium"
      variant="contained"
      color="secondary"
      id="filter-browse"
      onClick={handleBrowse}
    >
      Browse
    </Button>
  );
}

export default ChplFilterBrowse;

ChplFilterBrowse.propTypes = {
};
