import React, { useState } from 'react';
import {
  Button,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';

import theme from '../../../themes/theme';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
});

function ChplPrimaryButton() {
  const classes = useStyles();

  return (
    <Button color="primary" variant="contained">
    Primary Button
    <ArrowForwardIcon className={classes.iconSpacing}
    fontSize="small"
    />
    </Button>
  );
}

export default ChplPrimaryButton;