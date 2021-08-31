import React, { useState } from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';

import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
});

function SgDefaultButton() {
  const classes = useStyles();

  return (
    <Button size="medium" color="default" variant="contained">
    Default Button
    <CloseIcon className={classes.iconSpacing}
    fontSize="small"
    />
    </Button>
  );
}

export default SgDefaultButton;