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

import ChplCognitoLogin from './cognito-login';

import { usePostRefreshToken } from 'api/auth';
import { getAngularService } from 'services/angular-react-helper';
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
  const $rootScope = getAngularService('$rootScope');
  const authService = getAngularService('authService');
  const { user, impersonating, setUser } = useContext(UserContext);
  const { ssoIsOn } = useContext(FlagContext);
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
          authService.saveRefreshToken(cookies.refresh_token);
          setAuthTokens({
            accessToken: response.accessToken,
            refreshToken: cookies.refresh_token,
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
