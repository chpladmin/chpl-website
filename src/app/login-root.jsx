import React, { useContext, useEffect } from 'react';

import { ChplLoginToggle } from 'components/login';
import ChplCognitoToggle from 'components/login/cognito-toggle';
import { getAngularService } from 'services/angular-react-helper';
import { FlagContext, UserContext } from 'shared/contexts';

function ChplLoginRoot() {
  const Idle = getAngularService('Idle');
  const { ssoIsOn } = useContext(FlagContext);
  const { hasAnyRole } = useContext(UserContext);

  useEffect(() => {
    if (hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-cms-staff', 'chpl-developer'])) {
      Idle.watch();
    }
  }, [Idle, hasAnyRole]);

  if (ssoIsOn) {
    return (
      <ChplCognitoToggle />
    );
  }

  return (
    <ChplLoginToggle />
  );
}

export default ChplLoginRoot;
