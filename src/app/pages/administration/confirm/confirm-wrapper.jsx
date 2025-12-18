import React from 'react';
import { number, oneOfType, string } from 'prop-types';

import ChplConfirm from './confirm';

import AppWrapper from 'app-wrapper';

function ChplConfirmWrapper({ id }) {
  return (
    <AppWrapper>
      <ChplConfirm
        id={id}
      />
    </AppWrapper>
  );
}

export default ChplConfirmWrapper;

ChplConfirmWrapper.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
