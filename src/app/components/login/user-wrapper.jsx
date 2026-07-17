import React, { useEffect, useState } from 'react';
import { node } from 'prop-types';
import { clearAuthTokens } from 'axios-jwt';
import { useCookies } from 'react-cookie';

import ChplLogin from './login';

import { usePostLogout } from 'api/auth';
import { eventTrack } from 'services/analytics.service';
import { getAngularService } from 'services/angular-react-helper';
import { useLocalStorage as useStorage } from 'services/storage.service';
import { UserContext, useAnalyticsContext } from 'shared/contexts';

function UserWrapper({ children = <ChplLogin /> }) {
  const $rootScope = getAngularService('$rootScope');
  const authService = getAngularService('authService');
  const { analytics } = useAnalyticsContext();
  const postLogout = usePostLogout();
  const [loginWidgetState, setLoginWidgetState] = useState('SIGNIN');
  const [user, setUser] = useState({});
  const [, , removeCookie] = useCookies(['cognito_id', 'refresh_token']);
  const [, , removeJwtToken] = useStorage('ngStorage-jwtToken', '');
  const [, , removeRefreshToken] = useStorage('ngStorage-refreshToken', '');
  const [, , removeCurrentUser] = useStorage('ngStorage-currentUser', '');

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

  const logout = (e) => {
    e.stopPropagation();
    eventTrack({
      ...analytics,
      event: 'Log Out',
      category: 'Authentication',
    });
    if (user?.email) {
      postLogout.mutate({
        email: user.email,
      });
    }
    setUser({});
    removeCookie('cognito_id');
    removeCookie('refresh_token');
    removeJwtToken();
    removeRefreshToken();
    removeCurrentUser();
    setLoginWidgetState('SIGNIN');
    clearAuthTokens();
    $rootScope.$broadcast('loggedOut');
  };

  const userState = {
    hasAnyRole,
    hasAuthorityOn,
    loginWidgetState,
    logout,
    setLoginWidgetState,
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
