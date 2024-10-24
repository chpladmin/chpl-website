import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Popover,
  makeStyles,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { func } from 'prop-types';
import { getAccessToken } from 'axios-jwt';

import ChplCognitoLogin from './cognito-login';

import { FlagContext, UserContext } from 'shared/contexts';
import theme from 'themes/theme';

const useStyles = makeStyles({
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
});

function ChplCognitoToggle({ dispatch }) {
  const [anchor, setAnchor] = useState(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [state, setState] = useState('SIGNIN');
  const { user, impersonating } = useContext(UserContext);
  const { ssoIsOn } = useContext(FlagContext);
  const classes = useStyles();

  useEffect(() => {
    getAccessToken().then((token) => (token ? setState('LOGGEDIN') : setState('SIGNIN')));
  }, []);

  const handleClick = (e) => {
    setAnchor(e.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDispatch = (action) => {
    switch (action) {
      case 'forceChangePassword':
        dispatch(action);
        break;
      default:
        handleClose();
    }
  };

  useEffect(() => {
    if (user?.fullName) {
      setTitle(`${impersonating ? 'Impersonating ' : ''}${user.fullName}`);
    } else {
      setTitle('Administrator login');
    }
  }, [user, impersonating]);

  if (!ssoIsOn) { return null; }

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
          <ChplCognitoLogin
            dispatch={handleDispatch}
            setState={setState}
            state={state}
          />
        </div>
      </Popover>
    </>
  );
}

export default ChplCognitoToggle;

ChplCognitoToggle.propTypes = {
  dispatch: func,
};

ChplCognitoToggle.defaultProps = {
  dispatch: () => {},
};
