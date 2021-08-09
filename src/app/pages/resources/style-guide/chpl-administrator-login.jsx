import React, { useState } from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';

import ChplLogin from './chpl-login';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
});

function ChplAdministratorLogin () {
  const classes = useStyles();

  return (
    <ChplLogin
    anchor={
     <Button variant="contained" color="secondary">
       Administrator Login  
      <ArrowForwardIcon className={classes.iconSpacing}
      />
    </Button>
    } 
    />
  );
}

export default ChplAdministratorLogin;