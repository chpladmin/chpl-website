import React from 'react';
import { string } from 'prop-types';

import AppWrapper from 'app-wrapper';
import ChplApiKeyConfirm from 'components/api-key/api-key-confirm';

function ChplApiKeyConfirmWrapper({ hash }) {
  return (
    <AppWrapper>
      <ChplApiKeyConfirm
        hash={hash}
      />
    </AppWrapper>
  );
}

export default ChplApiKeyConfirmWrapper;

ChplApiKeyConfirmWrapper.propTypes = {
  hash: string.isRequired,
};
