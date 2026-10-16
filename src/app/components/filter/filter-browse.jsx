import React from 'react';
import { Button } from '@mui/material';
import { alpha } from '@mui/material/styles';

import { useFilterContext } from './filter-context';

import { eventTrack } from 'services/analytics.service';
import { palette } from 'themes';

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
      sx={{
        borderRadius: '8px',
        border: `1px solid ${palette.black}`,
        color: palette.black,
        padding: '9px 16px',
        '&:hover': {
          border: `1px solid ${palette.black}`,
          backgroundColor: alpha(palette.black, 0.05),
        },
      }}
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
