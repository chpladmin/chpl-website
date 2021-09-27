import React from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';

import SgLoginOptions from './sg-login-options';
import PersonIcon from '@material-ui/icons/Person';
const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
});

function SgAdministratorLoginOptions() {
  const classes = useStyles();

  return (
    <SgLoginOptions
      anchor={
        <Button variant="contained" color="secondary">
          $UserName
          <PersonIcon className={classes.iconSpacing} />
        </Button>
      }
    />
  );
}

export default SgAdministratorLoginOptions;