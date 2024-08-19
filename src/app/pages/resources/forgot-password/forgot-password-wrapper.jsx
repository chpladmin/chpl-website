import React from 'react';
import { string } from 'prop-types';

import ChplForgotPassword from './forgot-password';

import AppWrapper from 'app-wrapper';

function ChplForgotPasswordWrapper({ uuid }) {
  return (
    <AppWrapper>
      <ChplForgotPassword
        uuid={uuid}
      />
    </AppWrapper>
  );
}

export default ChplForgotPasswordWrapper;

ChplForgotPasswordWrapper.propTypes = {
  uuid: string.isRequired,
};
