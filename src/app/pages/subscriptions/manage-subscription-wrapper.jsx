import React from 'react';
import { string } from 'prop-types';

import ChplManageSubscription from './manage-subscription';

import AppWrapper from 'app-wrapper';

function ChplManageSubscriptionWrapper({ hash }) {
  return (
    <AppWrapper>
      <ChplManageSubscription
        hash={hash}
      />
    </AppWrapper>
  );
}

export default ChplManageSubscriptionWrapper;

ChplManageSubscriptionWrapper.propTypes = {
  hash: string.isRequired,
};
