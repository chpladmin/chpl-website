import React, { useEffect, useState } from 'react';
import { node } from 'prop-types';

import ChplLogin from './login';

import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';

function UserWrapper({ children }) {
  const $rootScope = getAngularService('$rootScope');
  const authService = getAngularService('authService');
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

  const canManageDeveloper = (developer) => {
    if (hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb'])) {
      return true;
    }
    if (hasAnyRole(['chpl-developer'])) {
      return user.organizations
        .filter((d) => d.id === developer.id)
        .length > 0;
    }
    return false;
  }

  const hasAnyRole = (roles) => {
    if (!user || !roles || roles.length === 0 || !user.role) {
      return false;
    }
    // TODO: remove these "if" when ssoIsOn is set to true
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
      roles.push('ROLE_ONC');
    }

    return roles.reduce((ret, role) => ret || user.role === role, false); // true iff user has a role in the required list
  };

  const hasAuthorityOn = (organization) => user?.organizations
        .filter((org) => org.id === organization.id)
        .length > 0;

  const userState = {
    canManageDeveloper,
    hasAnyRole,
    hasAuthorityOn,
    impersonating,
    setImpersonating,
    setUser,
    user,
  };

  return (
    <UserContext.Provider value={userState}>
      { children }
    </UserContext.Provider>
  );
}

export default UserWrapper;

UserWrapper.propTypes = {
  children: node,
};

UserWrapper.defaultProps = {
  children: <ChplLogin />,
};
