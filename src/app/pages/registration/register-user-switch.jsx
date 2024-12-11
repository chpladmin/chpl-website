import React, { useContext } from 'react';
import { string } from 'prop-types';

import ChplRegisterUser from './register-user';
import ChplRegisterUserOld from './register-user-old';

import { FlagContext } from 'shared/contexts';

function ChplRegisterUserSwitch({ hash }) {
  const { ssoIsOn } = useContext(FlagContext);

  if (!ssoIsOn) {
    return <ChplRegisterUserOld hash={hash} />;
  }

  return <ChplRegisterUser hash={hash} />;
}

export default ChplRegisterUserSwitch;

ChplRegisterUserSwitch.propTypes = {
  hash: string.isRequired,
};
