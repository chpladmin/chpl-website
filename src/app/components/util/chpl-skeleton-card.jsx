import React from 'react';
import { keyframes } from '@emotion/react';
import { Box } from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  arrayOf,
  node,
  object,
  oneOfType,
} from 'prop-types';

import { theme } from 'themes';

// The colour MUI fills Skeletons with, for the divider lines drawn inside a
// skeleton, such as between the rows of a results card
const skeletonLineColor = alpha(theme.palette.text.primary, 0.11);

// MUI Skeleton's own pulse animation, so the container pulses like the
// skeletons inside it
const pulse = keyframes({
  '0%': { opacity: 1 },
  '50%': { opacity: 0.4 },
  '100%': { opacity: 1 },
});

const styles = {
  // The real Card's corners, so the container takes the card's shape
  card: {
    borderRadius: '8px',
    overflow: 'hidden',
  },
  // How every skeleton container looks: a divider-coloured fill with MUI
  // Skeleton's pulse. This is the one place to change it, for every page.
  // Applied after `sx`, so a page's own styles can't override the fill
  fill: {
    backgroundColor: theme.palette.divider,
    animation: `${pulse} 2s ease-in-out 0.5s infinite`,
  },
};

// Card-shaped container for skeletons, so a loading page keeps the same layout
// of cards the loaded page will have
function ChplSkeletonCard({ children, sx = undefined }) {
  return (
    <Box sx={[styles.card, ...(Array.isArray(sx) ? sx : [sx]), styles.fill]}>
      { children }
    </Box>
  );
}

export default ChplSkeletonCard;
export { skeletonLineColor };

ChplSkeletonCard.propTypes = {
  children: node.isRequired,
  sx: oneOfType([object, arrayOf(object)]),
};
