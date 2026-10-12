import React from 'react';
import { string } from 'prop-types';

import ChplConfirmSubscription from './confirm-subscription';

function ChplConfirmSubscriptionWrapper({ hash }) {
  return (
    <>
      <ChplConfirmSubscription
        hash={hash}
      />
    </>
  );
}

export default ChplConfirmSubscriptionWrapper;

ChplConfirmSubscriptionWrapper.propTypes = {
  hash: string.isRequired,
};
