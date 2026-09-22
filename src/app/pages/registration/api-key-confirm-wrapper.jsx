import React from 'react';
import { string } from 'prop-types';

import ChplApiKeyConfirm from 'components/api-key/api-key-confirm';

function ChplApiKeyConfirmWrapper({ hash }) {
  return (
    <>
      <ChplApiKeyConfirm
        hash={hash}
      />
    </>
  );
}

export default ChplApiKeyConfirmWrapper;

ChplApiKeyConfirmWrapper.propTypes = {
  hash: string.isRequired,
};
