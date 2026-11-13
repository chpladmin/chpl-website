import React from 'react';
import { Box } from '@mui/material';
import { bool, node } from 'prop-types';

import { utilStyles } from 'themes';

const styles = {
  results: {
    transition: 'opacity 150ms ease-in-out',
  },
  updating: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
};

// Results already on screen while a new page of them loads, after a change of
// sort, page or filter. They stay in place, dimmed, instead of a skeleton (a
// refresh isn't a first load), and fade back in once the new results arrive.
// The status region stays mounted, so screen readers hear the change start.
function ChplResultsUpdating({ children, isUpdating = false }) {
  return (
    <>
      <Box component="span" sx={utilStyles.visuallyHidden} role="status" aria-live="polite">
        { isUpdating ? 'Updating results' : '' }
      </Box>
      <Box sx={[styles.results, isUpdating && styles.updating]} aria-busy={isUpdating}>
        { children }
      </Box>
    </>
  );
}

export default ChplResultsUpdating;

ChplResultsUpdating.propTypes = {
  children: node.isRequired,
  isUpdating: bool,
};
