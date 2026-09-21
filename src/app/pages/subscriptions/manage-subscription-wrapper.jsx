import React from 'react';
import { string } from 'prop-types';

import ChplManageSubscription from './manage-subscription';

function ChplManageSubscriptionWrapper({ hash }) {
  return (
    <>
      <ChplManageSubscription
        hash={hash}
      />
    </>
  );
}

export default ChplManageSubscriptionWrapper;

ChplManageSubscriptionWrapper.propTypes = {
  hash: string.isRequired,
};
