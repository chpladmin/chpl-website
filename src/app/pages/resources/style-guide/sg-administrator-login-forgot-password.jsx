import React from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';

import SgForgotPassword from './sg-forgot-password';
import PersonIcon from '@material-ui/icons/Person';
const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
  },
});

function SgAdministratorLoginForgotPassword () {
  const classes = useStyles();

  return (
    <SgForgotPassword
    anchor={
     <Button variant="contained" color="secondary">
       Administrator Login  
       <PersonIcon className={classes.iconSpacing}
      />
    </Button>
    } 
    />
  );
}

export default SgAdministratorLoginForgotPassword;