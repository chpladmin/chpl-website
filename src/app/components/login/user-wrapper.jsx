import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { node } from 'prop-types';
import { clearAuthTokens } from 'axios-jwt';

import ChplLogin from './login';
import { setLoginState, setUser } from './userInfo.slice';

import { usePostLogout } from 'api/auth';
import { eventTrack } from 'services/analytics.service';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext, useAnalyticsContext } from 'shared/contexts';

function UserWrapper({ children = <ChplLogin /> }) {
  const $rootScope = getAngularService('$rootScope');
  const user = useSelector((state) => state.userInfo.user);
  const dispatch = useDispatch();
  const { analytics } = useAnalyticsContext();
  const postLogout = usePostLogout();
  const [, , removeCookie] = useCookies(['cognito_id', 'refresh_token']);

  useEffect(() => {
    const update = () => {
      dispatch(setUser({ user: JSON.parse(localStorage.getItem('ngStorage-currentUser')) }));
    };
    update();
    const deregisterLoginWatcher = $rootScope.$on('loggedIn', update);
    return () => {
      deregisterLoginWatcher();
    };
  }, [$rootScope]);

  const hasAnyRole = (roles) => {
    if (!user || !roles || roles.length === 0 || !user.role) {
      return false;
    }
    return roles.reduce((ret, role) => ret || user.role === role, false); // true iff user has a role in the required list
  };

  const hasAuthorityOn = (organization) => user?.organizations
        .some((org) => org.id === organization.id);

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
    dispatch(setUser({}));
    removeCookie('cognito_id');
    removeCookie('refresh_token');
    localStorage.removeItem('ngStorage-currentUser');
    dispatch(setLoginState('SIGNIN'));
    clearAuthTokens();
    $rootScope.$broadcast('loggedOut');
  };

  const userState = {
    hasAnyRole,
    hasAuthorityOn,
    logout,
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
