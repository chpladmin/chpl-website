import React from 'react';
import { string } from 'prop-types';

import ChplForgotPassword from './forgot-password';

function ChplForgotPasswordWrapper({ uuid }) {
  return (
    <>
      <ChplForgotPassword
        uuid={uuid}
      />
    </>
  );
}

export default ChplForgotPasswordWrapper;

ChplForgotPasswordWrapper.propTypes = {
  uuid: string.isRequired,
};
