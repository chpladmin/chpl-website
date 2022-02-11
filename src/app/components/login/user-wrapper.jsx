import React, { createRef, useEffect, useState } from 'react';
import {
  Button,
  ThemeProvider,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Collapse from '@material-ui/core/Collapse';
import CloseIcon from '@material-ui/icons/Close';

import { node } from 'prop-types';
import { SnackbarProvider } from 'notistack';
import ChplLogin from './login';

import theme from 'themes/theme';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';

const useStyles = makeStyles({
    success: { 
      backgroundColor: '#356635',
    },
    error: { 
      backgroundColor: '#c44f65',
    },
    warning: { 
      backgroundColor: '#e6ea0b',
      color: '#000000',
    },
    info: { 
      backgroundColor: '#0e547f', 
    },
    containerRoot: { 
      flexWrap: 'nowrap',
      marginBottom: '64px',
      padding: '8px',
    },
    dismissButton: {
      marginRight: '8px',
    },
    iconSpacing: {
      marginLeft: '4px',
    },
  });

function UserWrapper(props) {
  const $rootScope = getAngularService('$rootScope');
  const authService = getAngularService('authService');
  const { children } = props;
  const [user, setUser] = useState({});
  const [impersonating, setImpersonating] = useState(false);

  useEffect(() => {
    const update = () => {
      setUser(authService.getCurrentUser());
      setImpersonating(authService.isImpersonating());
    };
    update();
    const deregisterLoginWatcher = $rootScope.$on('loggedIn', update);
    const deregisterLogoutWatcher = $rootScope.$on('loggedOut', update);
    const deregisterUnimpersonateWatcher = $rootScope.$on('unimpersonating', update);
    const deregisterImpersonateWatcher = $rootScope.$on('impersonating', update);
    return () => {
      deregisterLoginWatcher();
      deregisterLogoutWatcher();
      deregisterUnimpersonateWatcher();
      deregisterImpersonateWatcher();
    };
  }, [$rootScope, authService]);

  const hasAnyRole = (roles) => {
    if (!user || !roles || roles.length === 0 || !user.role) {
      return false;
    }
    return roles.reduce((ret, role) => ret || user.role === role, false); // true iff user has a role in the required list
  };

  const hasAuthorityOn = (organization) => user?.organizations
        .filter((org) => org.id === organization.id)
        .length > 0;

  const userState = {
    hasAnyRole,
    hasAuthorityOn,
    impersonating,
    setImpersonating,
    setUser,
    user,
  };

  const notistackRef = createRef();

  const onClickDismiss = (key) => () => {
    notistackRef.current.closeSnackbar(key);
  };
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        className={classes.containerRoot}
        anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
        }}
        classes={{
        variantSuccess: classes.success,
        variantError: classes.error,
        variantWarning: classes.warning,
        variantInfo: classes.info,
        }}
        TransitionComponent={Collapse}
        hideIconVariant
        autoHideDuration={null}
        ref={notistackRef}
        action={(key) => (
          <Button className={classes.dismissButton} color='default' variant='contained' onClick={onClickDismiss(key)}>
            Dismiss <CloseIcon className={classes.iconSpacing}/>
          </Button>
        )}
      >
        <UserContext.Provider value={userState}>
          { children }
        </UserContext.Provider>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default UserWrapper;

UserWrapper.propTypes = {
  children: node,
};

UserWrapper.defaultProps = {
  children: <ChplLogin />,
};
