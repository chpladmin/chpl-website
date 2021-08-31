import React from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
});

function SgPrimaryButton() {
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

export default SgPrimaryButton;