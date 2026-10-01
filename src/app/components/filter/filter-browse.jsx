import React from 'react';
import { Button } from '@mui/material';

import { useFilterContext } from './filter-context';

import { eventTrack } from 'services/analytics.service';

function ChplFilterBrowse() {
  const {
    analytics,
    dispatch,
    setSearchTerm,
  } = useFilterContext();

  const handleBrowse = () => {
    if (analytics) {
      eventTrack({
        ...analytics,
        event: 'Browse',
      });
    }
    setSearchTerm('');
    dispatch('resetAll');
    dispatch('hasSearched');
  };

  return (
    <Button
      sx={{ borderRadius: '8px', padding: '9px 16px' }}
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
