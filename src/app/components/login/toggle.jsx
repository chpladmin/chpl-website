import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Popover,
  makeStyles,
} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import { func } from 'prop-types';
import { getAccessToken, setAuthTokens } from 'axios-jwt';
import { useCookies } from 'react-cookie';

import ChplLogin from './login';
import ChplAdminMenu from './admin-menu';

import { usePostRefreshToken } from 'api/auth';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
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
  loggedInButton: {
    backgroundColor: '#0066cc',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#0052a3',
    },
  },
  whiteButton: {
    color: '#fff!important',
    textTransform: "capitalize!important",
    fontSize: '0.875rem'
  },
});

function ChplToggle({ dispatch = () => {} }) {
  const $rootScope = getAngularService('$rootScope');
  const authService = getAngularService('authService');
  const { user, setUser } = useContext(UserContext);
  const [cookies] = useCookies(['cognito_id', 'refresh_token']);
  const { mutate } = usePostRefreshToken();
  const [anchor, setAnchor] = useState(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [state, setState] = useState('SIGNIN');
  const classes = useStyles();

  useEffect(() => {
    getAccessToken().then((token) => (token ? setState('LOGGEDIN') : setState('SIGNIN')));
  }, []);

  useEffect(() => {
    if (user) { return; }
    if (cookies.cognito_id && cookies.refresh_token) {
      mutate({
        cognitoId: cookies.cognito_id,
        refreshToken: cookies.refresh_token,
      }, {
        onSuccess: (response) => {
          authService.saveToken(response.accessToken);
          authService.saveRefreshToken(response.refreshToken);
          setAuthTokens({
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          });
          setUser(response.user);
          authService.saveCurrentUser(response.user);
          $rootScope.$broadcast('loggedIn');
          $rootScope.$digest();
          setState('LOGGEDIN');
          dispatch('loggedIn');
        },
      });
    }
  }, [cookies]);

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

  const handleAdminMenuDispatch = ({ action }) => {
    switch (action) {
      case 'changePassword':
        setState('CHANGEPASSWORD');
        break;
      default:
        console.error(`No action found for ${action}`);
    }
  };

  useEffect(() => {
    if (user?.fullName) {
      setTitle(user.fullName);
    } else {
      setTitle('Administrator login');
    }
  }, [user]);

  return (
    <>
      <Button
        id="login-toggle"
        aria-describedby="admin-login-form"
        onClick={handleClick}
        className={classes.whiteButton}
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
        disableScrollLock
      >
        {state === 'LOGGEDIN' ? (
          <ChplAdminMenu onClose={handleClose} onDispatch={handleAdminMenuDispatch} />
        ) : (
          <div className={classes.loginCard}>
            <ChplLogin
              dispatch={handleDispatch}
              setState={setState}
              state={state}
            />
          </div>
        )}
      </Popover>
    </>
  );
}

export default ChplToggle;

ChplToggle.propTypes = {
  dispatch: func,
};
