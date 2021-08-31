import React, { useState } from 'react';
import Popover from '@material-ui/core/Popover';
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  makeStyles,
} from '@material-ui/core';

import VpnKeyIcon from '@material-ui/icons/VpnKey';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { ChplTextField } from '../../../components/util';

const useStyles = makeStyles({
    loginCard: {
      maxWidth:'400px',
    },
    content:{
        display: 'grid',
        gap: '8px',
    },
    iconSpacing: {
        marginLeft: '4px',
      },
  });

function SgLogin(props) {
  const classes = useStyles();
  const { anchor } = props;
  const [anchorElement, setAnchorElement] = useState(null);
  const handlePopoverClose = () => {
    setAnchorElement(null);
  };
  const handleClick = (event) => {
    setAnchorElement(event.currentTarget);
  };
  const open = Boolean(anchorElement);
  const id = open ? 'ChplAdministratorLogin' : undefined;

  return (
    <>
      <div
        // aria-owns={open ? 'assignedTo-popover' : undefined}
        // aria-haspopup='true'
        // onMouseEnter={handlePopoverOpen}
        // onMouseLeave={handlePopoverClose}
        aria-describedby={id}
        onClick={handleClick}>
        {anchor}
      </div>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorElement}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
       >
            <Card className={classes.loginCard}>
            <CardContent className={classes.content}>
            <ChplTextField
                id="email-user-name"
                name="emailUserName"
                label="Email or User Name"
                required/>
            
            <ChplTextField
                id="password"
                name="password"
                label="Password"
                required
                />
            <Typography variant="body2">This warning banner provides privacy and security notices consistent with applicable federal laws, directives, and other federal guidance for accessing this Government system, which includes all devices/storage media attached to this system. This system is provided for Government-authorized use only. Unauthorized or improper use of this system is prohibited and may result in disciplinary action and/or civil and criminal penalties. 
            </Typography>
            <Typography variant="body2">At any time, and for any lawful Government purpose, the government may monitor, record, and audit your system usage and/or intercept, search and seize any communication or data transiting or stored on this system. Therefore, you have no reasonable expectation of privacy. Any communication or data transiting or stored on this system may be disclosed or used for any lawful Government purpose.
            </Typography>
            </CardContent>
            <CardActions>
            <Button fullWidth color="primary" variant="contained">Log-In<VpnKeyIcon className={classes.iconSpacing}/></Button>
            <Button fullWidth color="secondary" variant="contained">Forget Password<HelpOutlineIcon className={classes.iconSpacing}/></Button>
            </CardActions>
            </Card>
      </Popover>
    </>
  );
}

export default SgLogin;
