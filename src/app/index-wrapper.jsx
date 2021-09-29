import React, { useEffect } from 'react';
import {
  ThemeProvider,
} from '@material-ui/core';

import theme from './themes/theme';
import {
  ChplLoginToggle,
  UserWrapper,
} from './components/login';
import { getAngularService } from './services/angular-react-helper';

function IndexWrapper() {
  const $rootScope = getAngularService('$rootScope');
  const Idle = getAngularService('Idle');
  const Keepalive = getAngularService('Keepalive');
  const authService = getAngularService('authService');
  const networkService = getAngularService('networkService');

  useEffect(() => {
    if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
      Idle.watch();
    }
    const deregisterKeepalive = $rootScope.$on('Keepalive', () => {
      console.info('Keepalive');
      if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
        networkService.keepalive()
          .then((response) => {
            authService.saveToken(response.token);
          });
      } else {
        Idle.unwatch();
      }
    });
    return deregisterKeepalive;
  }, [$rootScope, Idle, Keepalive, authService, networkService]);

  return (
    <ThemeProvider theme={theme}>
      <UserWrapper>
        <ChplLoginToggle />
      </UserWrapper>
    </ThemeProvider>
  );
}

export default IndexWrapper;
