import React from 'react';
import { string } from 'prop-types';

import ChplRegisterUser from './register-user';

function ChplRegisterUserWrapper(props) {
  const { hash } = props;
  return (
    <>
      <ChplRegisterUser
        hash={hash}
      />
    </>
  );
}

export default ChplRegisterUserWrapper;

ChplRegisterUserWrapper.propTypes = {
  hash: string.isRequired,
};
