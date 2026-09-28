import { clearAuthTokens } from 'axios-jwt';

import { clearUser, setLoginState } from 'components/login/userInfo.slice';

const SESSION_COOKIES = ['cognito_id', 'refresh_token'];

const hasAnyRole = (user, roles) => {
  if (!user || !roles || roles.length === 0 || !user.role) {
    return false;
  }
  return roles.some((role) => user.role === role); // true iff user has a role in the required list
};

// `removeCookie` comes from `useCookies`, so the session cookies are cleared
// with the same options `CookiesProvider` set them with.
const clearSession = (dispatch, removeCookie) => {
  SESSION_COOKIES.forEach((name) => removeCookie(name));
  clearAuthTokens();
  dispatch(clearUser());
  dispatch(setLoginState('SIGNIN'));
};

export {
  clearSession,
  hasAnyRole,
  SESSION_COOKIES,
};
