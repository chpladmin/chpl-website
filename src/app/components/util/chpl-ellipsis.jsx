import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { bool, number, string } from 'prop-types';

import ChplTooltip from './chpl-tooltip';

import { utilStyles } from 'themes';

const styles = {
  chplEllipsis: {
    border: 'none',
    backgroundColor: 'transparent',
    color: '#156dac',
    '&:hover': {
      color: '#00437c',
    },
  },
};

function ChplEllipsis({
  text,
  maxLength = 80,
  wordBoundaries = false,
}) {
  const [isShortened, setShortened] = useState(true);

  if (!text) {
    return null;
  }

  if (text.length <= maxLength) {
    return <span>{text}</span>;
  }

  let display = text.substr(0, maxLength).trim();
  if (wordBoundaries) {
    const parts = display.split(' ');
    if (parts.length > 1) {
      parts.splice(parts.length - 1, 1);
    }
    display = parts.join(' ');
  }

  return (
    <>
      { isShortened ? display : text }
      { display !== text && isShortened
       && (
         <ChplTooltip title={text}>
           <IconButton
             size="small"
             sx={styles.chplEllipsis}
             onClick={() => setShortened(false)}
           >
             <MoreHorizIcon />
             <Box component="span" sx={utilStyles.srOnly}>Expand description</Box>
           </IconButton>
         </ChplTooltip>
       )}
      { display !== text && !isShortened
       && (
         <IconButton
           size="small"
           sx={styles.chplEllipsis}
           onClick={() => setShortened(true)}
         >
           <ArrowBackIcon />
           <Box component="span" sx={utilStyles.srOnly}>Minimize description</Box>
         </IconButton>
       )}
    </>
  );
}

export default ChplEllipsis;

ChplEllipsis.propTypes = {
  text: string.isRequired,
  maxLength: number,
  wordBoundaries: bool,
};
