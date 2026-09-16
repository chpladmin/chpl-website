import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { node } from 'prop-types';

import ChplLogin from './login';

import { usePostLogout } from 'api/auth';
import { eventTrack } from 'services/analytics.service';
import { clearSession, hasAnyRole, SESSION_COOKIES } from 'services/auth.service';
import { UserContext, useAnalyticsContext } from 'shared/contexts';

function UserWrapper({ children = <ChplLogin /> }) {
  const user = useSelector((state) => state.userInfo.user);
  const dispatch = useDispatch();
  const { analytics } = useAnalyticsContext();
  const postLogout = usePostLogout();
  const [, , removeCookie] = useCookies(SESSION_COOKIES);

  const hasAuthorityOn = (organization) => user?.organizations
        ?.some((org) => org.id === organization.id);

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
    clearSession(dispatch, removeCookie);
  };

  const userState = {
    hasAnyRole: (roles) => hasAnyRole(user, roles),
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
