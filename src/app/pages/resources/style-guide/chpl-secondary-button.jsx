import React, { useState } from 'react';
import {
  Button,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';

import theme from '../../../themes/theme';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
});

function ChplSecondaryButton() {
  const classes = useStyles();

  return (
    <Button color="secondary" variant="contained">
    Secondary Button
    <ArrowBackIcon className={classes.iconSpacing}
    fontSize="small"
    />
    </Button>
  );
}

export default ChplSecondaryButton;