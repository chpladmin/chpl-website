import React from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';

import { useFilterContext } from './filter-context';

import { eventTrack } from 'services/analytics.service';

const useStyles = makeStyles({
  browseButton: {
    borderRadius: '8px',
    padding: '9px 16px',
  },
});

function ChplFilterBrowse() {
  const classes = useStyles();

  const {
    analytics,
    dispatch,
    setSearchTerm,
  } = useFilterContext();

  const handleBrowse = () => {
    if (analytics) {
      eventTrack({
        event: 'Browse',
        category: analytics.category,
        group: analytics.group,
      });
    }
    setSearchTerm('');
    dispatch('resetAll');
    dispatch('hasSearched');
  };

  return (
    <Button
      className={classes.browseButton}
      size="medium"
      variant="outlined"
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
