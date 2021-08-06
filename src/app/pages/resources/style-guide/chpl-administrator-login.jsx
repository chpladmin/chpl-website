import React, { useState } from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';

import ChplLogin from './chpl-login';
import FilterListIcon from '@material-ui/icons/FilterList';

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
      <FilterListIcon 
      />
    </Button>
    } 
    />
  );
}

export default ChplAdministratorLogin;