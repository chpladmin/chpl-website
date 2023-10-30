import React, { useEffect } from 'react';

import AppWrapper from './app-wrapper';

import { ChplLoginToggle } from 'components/login';
import { getAngularService } from 'services/angular-react-helper';

function IndexWrapper() {
  const $rootScope = getAngularService('$rootScope');
  const Idle = getAngularService('Idle');
  const Keepalive = getAngularService('Keepalive');
  const authService = getAngularService('authService');
  const networkService = getAngularService('networkService');

  useEffect(() => {
    if (authService.hasAnyRole(['CHPL-ADMIN', 'ROLE_ONC', 'ROLE_ACB', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
      Idle.watch();
    }
    const deregisterKeepalive = $rootScope.$on('Keepalive', () => {
      console.info('Keepalive');
      if (authService.hasAnyRole(['CHPL-ADMIN', 'ROLE_ONC', 'ROLE_ACB', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
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
    <AppWrapper showQueryTools={false}>
      <ChplLoginToggle />
    </AppWrapper>
  );
}

export default IndexWrapper;
