import React from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';

import SgLogin from './sg-login';
import PersonIcon from '@material-ui/icons/Person';
const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
});

function SgAdministratorLogin() {
  const classes = useStyles();

  return (
    <SgLogin
      anchor={
        <Button variant="contained" color="secondary">
          Administrator Login
          <PersonIcon className={classes.iconSpacing} />
        </Button>
      }
    />
  );
}

export default SgAdministratorLogin;