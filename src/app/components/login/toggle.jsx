import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Popover,
  Typography,
  makeStyles,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CloseIcon from '@material-ui/icons/Close';
import { func } from 'prop-types';
import { getAccessToken, setAuthTokens } from 'axios-jwt';
import { useCookies } from 'react-cookie';

import ChplLogin from './login';
import ChplAdminMenu from './admin-menu';

import { usePostRefreshToken } from 'api/auth';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import { theme, palette } from 'themes';

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
  whiteButton: {
    color: '#fff!important',
    textTransform: 'capitalize!important',
    fontSize: '1rem',
    '&:hover': {
      backgroundColor: `${palette.primaryDark}!important`,
      color: '#fff!important',
    },
    '&[aria-expanded="true"]': {
      backgroundColor: `${palette.white}!important`,
      color: `${palette.greyDark}!important`,
      fontWeight: 'bold',
    },
  },
  drawerPaper: {
    width: 280,
    maxWidth: '100vw',
    backgroundColor: palette.white,
    color: palette.greyDark,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 4px 0px 14px',
  },
  drawerContent: {
    paddingBottom: '8px',
  },
  drawerDivider: {
    backgroundColor: palette.divider,
  },
  drawerLoginCard: {
    width: '100%',
    maxWidth: '280px',
    padding: '0 8px 8px',
  },
});

function ChplToggle({ dispatch = () => {} }) {
  const $rootScope = getAngularService('$rootScope');
  const authService = getAngularService('authService');
  const {
    loginWidgetState,
    setLoginWidgetState,
    user,
    setUser,
  } = useContext(UserContext);
  const [cookies] = useCookies(['cognito_id', 'refresh_token']);
  const { mutate } = usePostRefreshToken();
  const [anchor, setAnchor] = useState(null);
  const [loginPopoverOpen, setLoginPopoverOpen] = useState(false);
  const [adminDrawerOpen, setAdminDrawerOpen] = useState(false);
  const [title, setTitle] = useState('');
  const classes = useStyles();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isToggleOpen = isMobile ? adminDrawerOpen : loginPopoverOpen;

  useEffect(() => {
    getAccessToken().then((token) => (token ? setLoginWidgetState('LOGGEDIN') : setLoginWidgetState('SIGNIN')));
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
          setLoginWidgetState('LOGGEDIN');
          dispatch('loggedIn');
        },
      });
    }
  }, [cookies]);

  const handleClick = (e) => {
    if (isMobile) {
      setAdminDrawerOpen(true);
      return;
    }
    setAnchor(e.currentTarget);
    setLoginPopoverOpen(true);
  };

  const handleClose = () => {
    setLoginPopoverOpen(false);
    setAdminDrawerOpen(false);
    setAnchor(null);
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
        aria-expanded={isToggleOpen ? 'true' : undefined}
        onClick={handleClick}
        className={classes.whiteButton}
      >
        { title }
      </Button>
      <Popover
        id="admin-login-form"
        open={loginPopoverOpen}
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
        { loginWidgetState === 'LOGGEDIN' ? (
          <ChplAdminMenu onClose={handleClose} />
        ) : (
          <div className={classes.loginCard}>
            <ChplLogin
              dispatch={handleDispatch}
            />
          </div>
        )}
      </Popover>
      <Drawer
        anchor="right"
        open={isMobile && adminDrawerOpen}
        onClose={handleClose}
        classes={{ paper: classes.drawerPaper }}
      >
        <Box className={classes.drawerContent}>
          <Box className={classes.drawerHeader}>
            <Typography variant="h6">Administrator Navigation</Typography>
            <IconButton onClick={handleClose} aria-label="close admin menu">
              <CloseIcon color="primary" />
            </IconButton>
          </Box>
          <Divider className={classes.drawerDivider} />
          { loginWidgetState === 'LOGGEDIN' ? (
            <ChplAdminMenu onClose={handleClose} />
          ) : (
            <div className={classes.drawerLoginCard}>
              <ChplLogin
                dispatch={handleDispatch}
              />
            </div>
          )}
        </Box>
      </Drawer>
    </>
  );
}

export default ChplToggle;

ChplToggle.propTypes = {
  dispatch: func,
};
