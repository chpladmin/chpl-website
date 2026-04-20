import React from 'react';
import {
  Box,
  LinearProgress,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { number, oneOfType, string } from 'prop-types';

import { palette, utilStyles } from 'themes';

const getProgressColor = (value) => {
  if (value >= 100) return palette.active;
  if (value < 25) return palette.error;
  return palette.primary;
};

const useStyles = makeStyles({
  ...utilStyles,
  progressBarWrapperNoShrink: {
    flexShrink: 0,
  },
  linearProgressRootRounded: {
    height: '16px',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  linearProgressTrackColorByThreshold: {
    backgroundColor: ({ progressValue }) => {
      if (progressValue >= 100) return palette.progressSuccessTrack;
      if (progressValue < 25) return palette.progressErrorTrack;
      return palette.primaryLight;
    },
  },
  linearProgressFillColorByThreshold: {
    backgroundColor: ({ progressValue }) => getProgressColor(progressValue),
  },
  linearProgressDeterminateFillColorByThreshold: {
    backgroundColor: ({ progressValue }) => getProgressColor(progressValue),
  },
});

function CmsDisplayProgressBar({ value, year }) {
  const classes = useStyles({ progressValue: value });

  const normalizedValue = Number.isFinite(Number(value))
    ? Math.min(100, Math.max(0, Number(value)))
    : 0;
  return (
    <Box
      pt={2}
      gridGap={8}
      pb={2}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      id="progress-bar"
    >
      <Box width="150px" className={classes.progressBarWrapperNoShrink}>
        <LinearProgress
          id="progress-bar-bar"
          variant="determinate"
          value={normalizedValue}
          classes={{
            root: classes.linearProgressRootRounded,
            colorPrimary: classes.linearProgressTrackColorByThreshold,
            barColorPrimary: classes.linearProgressFillColorByThreshold,
            bar1Determinate: classes.linearProgressDeterminateFillColorByThreshold,
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
