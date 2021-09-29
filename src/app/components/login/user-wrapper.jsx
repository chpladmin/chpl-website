import React, { useEffect, useState } from 'react';
import {
  ThemeProvider,
} from '@material-ui/core';
import { node } from 'prop-types';

import theme from '../../themes/theme';
import ChplLogin from './login';
import { getAngularService } from '../../services/angular-react-helper';
import { UserContext } from '../../shared/contexts';

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

  const userState = {
    user,
    setUser,
    impersonating,
    setImpersonating,
  };

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={userState}>
        { children }
      </UserContext.Provider>
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
