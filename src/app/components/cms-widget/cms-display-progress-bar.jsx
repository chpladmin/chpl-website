import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';
import { number, oneOfType, string } from 'prop-types';

import { palette } from 'themes';

const getProgressColor = (value) => {
  if (value >= 100) return palette.active;
  if (value < 25) return palette.error;
  return palette.primary;
};

const getProgressTrackColor = (value) => {
  if (value >= 100) return palette.progressSuccessTrack;
  if (value < 25) return palette.progressErrorTrack;
  return palette.primaryLight;
};

const styles = {
  progressBarWrapperNoShrink: {
    flexShrink: 0,
  },
};

function CmsDisplayProgressBar({ value, year }) {
  const normalizedValue = Number.isFinite(Number(value))
    ? Math.min(100, Math.max(0, Number(value)))
    : 0;
  return (
    <Box
      pt={2}
      gap="8px"
      pb={2}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      id="progress-bar"
    >
      <Box width="150px" sx={styles.progressBarWrapperNoShrink}>
        <LinearProgress
          id="progress-bar-bar"
          variant="determinate"
          value={normalizedValue}
          sx={{
            height: '16px',
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: getProgressTrackColor(normalizedValue),
            '& .MuiLinearProgress-bar': {
              backgroundColor: getProgressColor(normalizedValue),
            },
          }}
        />
      </Box>
      <Box>
        <Typography
          variant="h6"
          color="textPrimary"
          id="progress-bar-text"
        >
          <strong>
            { value }
            %
          </strong>
          {' '}
          Base Criteria Met
          {year !== '2015'
             && (
               <>
                 {' '}
                 for CY
                 {year}
               </>
             )}
        </Typography>
      </Box>
    </Box>
  );
}

CmsDisplayProgressBar.propTypes = {
  value: oneOfType([
    number,
    string,
  ]).isRequired,
  year: string.isRequired,
};

export default CmsDisplayProgressBar;
