import React from 'react';
import { string } from 'prop-types';

import ChplRegisterUser from './register-user';

import AppWrapper from 'app-wrapper';

function ChplRegisterUserWrapper(props) {
  const { hash } = props;
  return (
    <AppWrapper>
      <ChplRegisterUser
        hash={hash}
      />
    </AppWrapper>
  );
}

export default ChplRegisterUserWrapper;

ChplRegisterUserWrapper.propTypes = {
  hash: string.isRequired,
};
