import React, { useEffect } from 'react';

import AppWrapper from './app-wrapper';

import { ChplLoginToggle } from 'components/login';
import ChplCognitoToggle from 'components/login/cognito-toggle';
import { getAngularService } from 'services/angular-react-helper';

function IndexWrapper() {
  const Idle = getAngularService('Idle');
  const authService = getAngularService('authService');

  useEffect(() => {
    if (authService.hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-cms-staff', 'chpl-developer'])) {
      Idle.watch();
      console.log('Starting Idle in IndexWrapper');
    }
  }, [Idle, authService]);

  return (
    <AppWrapper showQueryTools={false}>
      <ChplCognitoToggle />
      <ChplLoginToggle />
    </AppWrapper>
  );
}

export default IndexWrapper;
