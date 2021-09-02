import React, { useState } from 'react';
import Popover from '@material-ui/core/Popover';
import {
  Button,
  Card,
  CardContent,
  makeStyles,
} from '@material-ui/core';

import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import { ChplTextField } from '../../../components/util';

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

function SgForgotPassword(props) {
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
                id="email"
                name="email"
                label="Email"
                required
                helperText="sample@example.com"
                />
            <Button fullWidth color="primary" variant="contained">Send Reset Email<SendIcon className={classes.iconSpacing}/></Button>
            <Button fullWidth color="default" variant="contained">Cancel<CloseIcon className={classes.iconSpacing}/></Button>
            </CardContent>
            </Card>
      </Popover>
    </>
  );
}

export default SgForgotPassword;
