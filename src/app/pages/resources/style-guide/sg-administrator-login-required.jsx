import React, { useState } from 'react';
import {
  Button, 
  Card,
  CardContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { ChplTextField } from '../../../components/util';

const useStyles = makeStyles(() => ({
    loginCard: {
        maxWidth:'auto',
      },
      content:{
          display: 'grid',
          gap: '8px',
      },
      iconSpacing: {
          marginLeft: '4px',
        },
  }));

function SgAdministratorLoginRequired() {
  const classes = useStyles();

  return (
    <Card className={classes.loginCard}>
    <CardContent className={classes.content}>
    <Typography gutterBottom variant="h1">Login Required
            </Typography>
    <ChplTextField
                id="email-user-name"
                name="emailUserName"
                label="Email or User Name"
                required
                helperText="Enter email or user name"
                />
            
            <ChplTextField
                id="password"
                name="password"
                label="Password"
                required
                helperText="Enter Password"

                />
        <Button fullWidth color="primary" variant="contained">Log-In<VpnKeyIcon className={classes.iconSpacing}/></Button>
            <Button fullWidth color="secondary" variant="contained">Forget Password<HelpOutlineIcon className={classes.iconSpacing}/></Button>
            <Typography variant="body2">This warning banner provides privacy and security notices consistent with applicable federal laws, directives, and other federal guidance for accessing this Government system, which includes all devices/storage media attached to this system. This system is provided for Government-authorized use only. Unauthorized or improper use of this system is prohibited and may result in disciplinary action and/or civil and criminal penalties. 
            </Typography>
            <Typography variant="body2">At any time, and for any lawful Government purpose, the government may monitor, record, and audit your system usage and/or intercept, search and seize any communication or data transiting or stored on this system. Therefore, you have no reasonable expectation of privacy. Any communication or data transiting or stored on this system may be disclosed or used for any lawful Government purpose.
            </Typography>
        </CardContent>
        </Card>
  );
}

export default SgAdministratorLoginRequired;
