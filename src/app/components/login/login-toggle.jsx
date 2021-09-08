import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Popover,
} from '@material-ui/core';

import { UserContext } from '../../shared/contexts';
import ChplLogin from './login';

function ChplLoginToggle() {
  /* eslint-disable react/destructuring-assignment */
  const [anchor, setAnchor] = useState(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const {
    user, impersonating,
  } = useContext(UserContext);
  /* eslint-enable react/destructuring-assignment */

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
        color="primary"
        variant="outlined"
        id="login-toggle"
        aria-describedby="admin-login-form"
        onClick={handleClick}
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
      >
        <ChplLogin />
      </Popover>
    </>
  );
}

export default ChplLoginToggle;
