import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Popover,
  makeStyles,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

import ChplLogin from './login';

import { UserContext } from 'shared/contexts';
import theme from 'themes/theme';

const useStyles = makeStyles(() => ({
  loginSpacing: {
    margin: '8px',
  },
  popoverSpacing: {
    marginLeft: '8px',
  },
  loginCard: {
    width: '300px',
    [theme.breakpoints.up('md')]: {
      width: '375px',
    },
  },
}));

function ChplLoginToggle() {
  const [anchor, setAnchor] = useState(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const { user, impersonating } = useContext(UserContext);
  const classes = useStyles();

  const handleClick = (e) => {
    setAnchor(e.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchor(null);
    setOpen(false);
  };

  const handleDispatch = () => {
    handleClose();
  };

  useEffect(() => {
    if (user?.fullName) {
      setTitle(`${impersonating ? 'Impersonating ' : ''}${user.fullName}`);
    } else {
      setTitle('Administrator login');
    }
  }, [user, impersonating]);

  return (
    <>
      <Button
        color="secondary"
        variant="contained"
        id="login-toggle"
        aria-describedby="admin-login-form"
        onClick={handleClick}
        className={classes.loginSpacing}
        endIcon={<PersonIcon />}
      >
        { title }
      </Button>
      <Popover
        id="admin-login-form"
        open={open}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        className={classes.popoverSpacing}
      >
        <div className={classes.loginCard}>
          <ChplLogin
            dispatch={handleDispatch}
          />
        </div>
      </Popover>
    </>
  );
}

export default ChplLoginToggle;
