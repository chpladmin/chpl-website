import React from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';

import SgLoginChangePassword from './sg-login-change-password';
import PersonIcon from '@material-ui/icons/Person';
const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
});

function SgAdministratorLoginChangePassword() {
  const classes = useStyles();

  return (
    <SgLoginChangePassword
      anchor={
        <Button variant="contained" color="secondary">
          $UserName
          <PersonIcon className={classes.iconSpacing} />
        </Button>
      }
    />
  );
}

export default SgAdministratorLoginChangePassword;