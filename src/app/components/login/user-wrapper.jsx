import React, { useEffect, useState } from 'react';
import {
  ThemeProvider,
} from '@material-ui/core';
import { node } from 'prop-types';

import ChplLogin from './login';

import { SnackbarWrapper } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import theme from 'themes/theme';

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
    if (!user || !roles || roles.length === 0 || !user.groupName) {
      return false;
    }
    if (roles.includes('chpl-admin')) {
      roles.push('ROLE_ADMIN');
    }
    if (roles.includes('chpl-onc-acb')) {
      roles.push('ROLE_ACB');
    }
    if (roles.includes('chpl-developer')) {
      roles.push('ROLE_DEVELOPER');
    }
    if (roles.includes('chpl-onc')) {
      roles.push('chpl-onc');
    }

    return roles.reduce((ret, role) => ret || user.groupName === role, false); // true iff user has a role in the required list
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

  return (
    <ThemeProvider theme={theme}>
      <SnackbarWrapper>
        <UserContext.Provider value={userState}>
          { children }
        </UserContext.Provider>
      </SnackbarWrapper>
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
