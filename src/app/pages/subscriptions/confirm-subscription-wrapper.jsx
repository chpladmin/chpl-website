import React from 'react';
import { string } from 'prop-types';

import ChplConfirmSubscription from './confirm-subscription';

import AppWrapper from 'app-wrapper';

function ChplConfirmSubscriptionWrapper({ hash }) {
  return (
    <AppWrapper>
      <ChplConfirmSubscription
        hash={hash}
      />
    </AppWrapper>
  );
}

export default ChplConfirmSubscriptionWrapper;

ChplConfirmSubscriptionWrapper.propTypes = {
  hash: string.isRequired,
};
