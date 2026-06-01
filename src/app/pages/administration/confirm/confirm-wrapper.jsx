import React from 'react';
import { number, oneOfType, string } from 'prop-types';

import ChplConfirm from './confirm';

import AppWrapper from 'app-wrapper';
import { ChplPageBody, ChplPageHeader } from 'components/util';

function ChplConfirmWrapper({ id }) {
  return (
    <AppWrapper>
      <ChplPageHeader text="Confirm Pending Listing" />
      <ChplPageBody>
        <ChplConfirm
          id={id}
        />
      </ChplPageBody>
    </AppWrapper>
  );
}

export default ChplConfirmWrapper;

ChplConfirmWrapper.propTypes = {
  id: oneOfType([number, string]).isRequired,
};
