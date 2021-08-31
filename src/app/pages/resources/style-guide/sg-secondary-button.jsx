import React from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';

import ArrowBackIcon from '@material-ui/icons/ArrowBack';

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
});

function SgSecondaryButton() {
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

export default SgSecondaryButton;