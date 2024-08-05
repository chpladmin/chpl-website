import React, { useEffect } from 'react';

import AppWrapper from './app-wrapper';

import { ChplLoginToggle } from 'components/login';
import ChplCognitoToggle from 'components/login/cognito-toggle';
import { getAngularService } from 'services/angular-react-helper';

function IndexWrapper() {
  const $rootScope = getAngularService('$rootScope');
  const Idle = getAngularService('Idle');
  const Keepalive = getAngularService('Keepalive');
  const authService = getAngularService('authService');
  const networkService = getAngularService('networkService');
  const ngLocalStorage = getAngularService('$localStorage');

  const isCurrentUserChplAuthenticated = ngLocalStorage.currentUser && ngLocalStorage.currentUser.userId;

  useEffect(() => {
    let deregisterKeepalive;
    if (isCurrentUserChplAuthenticated) {
      if (authService.hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'ROLE_CMS_STAFF', 'chpl-developer'])) {
        Idle.watch();
      }
      deregisterKeepalive = $rootScope.$on('Keepalive', () => {
        console.info('Keepalive');
        if (authService.hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'ROLE_CMS_STAFF', 'chpl-developer'])) {
          networkService.keepalive()
            .then((response) => {
              authService.saveToken(response.token);
            });
        } else {
          Idle.unwatch();
        }
      });
    }
    return deregisterKeepalive;
  }, [$rootScope, Idle, Keepalive, authService, networkService]);

  return (
    <AppWrapper showQueryTools={false}>
      <ChplCognitoToggle />
      <ChplLoginToggle />
    </AppWrapper>
  );
}

export default IndexWrapper;
