import React, { useState } from 'react';
import {
  Button,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';

import theme from '../../../themes/theme';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
});

function ChplDefaultButton() {
  const classes = useStyles();

  return (
    <Button color="default" variant="contained">
    Default Button
    <CloseIcon className={classes.iconSpacing}
    fontSize="small"
    />
    </Button>
  );
}

export default ChplDefaultButton;