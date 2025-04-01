import React, { useEffect, useState } from 'react';
import { node } from 'prop-types';

import ChplLogin from './cognito-login';

import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';

function UserWrapper({ children }) {
  const $rootScope = getAngularService('$rootScope');
  const authService = getAngularService('authService');
  const [user, setUser] = useState({});

  useEffect(() => {
    const update = () => {
      setUser(authService.getCurrentUser());
    };
    update();
    const deregisterLoginWatcher = $rootScope.$on('loggedIn', update);
    const deregisterLogoutWatcher = $rootScope.$on('loggedOut', update);
    return () => {
      deregisterLoginWatcher();
      deregisterLogoutWatcher();
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
