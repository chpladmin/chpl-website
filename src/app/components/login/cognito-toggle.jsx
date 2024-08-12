import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Popover,
  makeStyles,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { func } from 'prop-types';
import { getAccessToken } from 'axios-jwt';
import regeneratorRuntime from "regenerator-runtime";

import ChplCognitoLogin from './cognito-login';

import { FlagContext, UserContext } from 'shared/contexts';
import theme from 'themes/theme';
import { getIn } from 'yup/lib/util/reach';

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
  const { isOn } = useContext(FlagContext);
  const [ssoIsOn, setSsoIsOn] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    getAccessToken().then((token) => (token ? setState('LOGGEDIN') : setState('SIGNIN')));
  }, []);

  useEffect(() => {
    setSsoIsOn(isOn('sso'));
  }, [isOn]);

  const handleClick = (e) => {
    setAnchor(e.currentTarget);
    setOpen(true);
  };

  const handleClose = () => {
    setAnchor(null);
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
        id="login-cognito-toggle"
        aria-describedby="admin-login-form-cognito"
        onClick={handleClick}
        className={classes.loginSpacing}
        endIcon={<PersonIcon />}
      >
        { title }
      </Button>
      <Popover
        id="admin-login-form-cognito"
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
