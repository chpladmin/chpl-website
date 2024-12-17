import React from 'react';
import { string } from 'prop-types';

import ChplRegisterUserSwitch from './register-user-switch';

import AppWrapper from 'app-wrapper';

function ChplRegisterUserWrapper(props) {
  const { hash } = props;
  return (
    <AppWrapper>
      <ChplRegisterUserSwitch
        hash={hash}
      />
    </AppWrapper>
  );
}

export default ChplRegisterUserWrapper;

ChplRegisterUserWrapper.propTypes = {
  hash: string.isRequired,
};
