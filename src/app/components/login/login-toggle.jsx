import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Popover,
  makeStyles,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';

import { UserContext } from '../../shared/contexts';
import theme from '../../themes/theme';

import ChplLogin from './login';

const useStyles = makeStyles(() => ({
  iconSpacing: {
    marginLeft: '4px',
  },
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
  /* eslint-disable react/destructuring-assignment */
  const [anchor, setAnchor] = useState(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const {
    user, impersonating,
  } = useContext(UserContext);
  /* eslint-enable react/destructuring-assignment */
  const classes = useStyles();
  const handleClick = (e) => {
    setAnchor(e.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchor(null);
    setOpen(false);
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
      >
        { title }
        <PersonIcon className={classes.iconSpacing} />
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
          <ChplLogin />
        </div>
      </Popover>
    </>
  );
}

export default ChplLoginToggle;
