import React from 'react';
import {
  Box,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import { number } from 'prop-types';

import ChplLogo from '../../../assets/favicons/android-chrome-192x192.png';

import { palette } from 'themes';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flex: '1 0 auto',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: '64px 16px',
  },
  spinnerWrapper: {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
});

function ChplLoadingSpinner({ size = 96 }) {
  const classes = useStyles();
  const logoSize = size * 0.55;

  return (
    <Box className={classes.container}>
      <Box className={classes.spinnerWrapper}>
        <CircularProgress size={size} thickness={2.5} style={{ color: palette.primary }} />
        <img
          className={classes.logo}
          src={ChplLogo}
          alt="Loading"
          style={{ width: `${logoSize}px`, height: `${logoSize}px` }}
        />
      </Box>
    </Box>
  );
}

export default ChplLoadingSpinner;

ChplLoadingSpinner.propTypes = {
  size: number,
};
