import React, { useState } from 'react';
import Popover from '@material-ui/core/Popover';
import {
  Button,
  Card,
  CardContent,
  makeStyles,
} from '@material-ui/core';

import VpnKeyIcon from '@material-ui/icons/VpnKey';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import { ChplTextField } from '../../../components/util';
import SgPasswordDeterminate from './sg-password-determinate';
const useStyles = makeStyles({
    loginCard: {
      maxWidth:'350px',
    },
    content:{
        display: 'grid',
        gap: '8px',
    },
    iconSpacing: {
        marginLeft: '4px',
      },
  });

function SgLoginChangePassword(props) {
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
        // onMouseEnter={handlePopoverOpen}a
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
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
       >
            <Card className={classes.loginCard}>
            <CardContent className={classes.content}>
            <ChplTextField
                id="old-password"
                name="oldPassword"
                label="Old Password"
                required
                helperText="Enter your last password"
                />
            
            <ChplTextField
                       id="new-password"
                       name="newPassword"
                       label="New Password"
                       required
                       helperText="Enter your new password"
                />
            <SgPasswordDeterminate/>
            <ChplTextField
                       id="confirm-password"
                       name="confirmPassword"
                       label="Confirm New Password"
                       required
                       helperText="Renter your new password"
                />  
            <Button fullWidth color="primary" variant="contained">Confirm New Password<VpnKeyIcon className={classes.iconSpacing}/></Button>
            <Button fullWidth color="default" variant="contained">Cancel<HelpOutlineIcon className={classes.iconSpacing}/></Button>
            </CardContent>
            </Card>
      </Popover>
    </>
  );
}

export default SgLoginChangePassword;
