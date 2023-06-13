import React from 'react';
import { number } from 'prop-types';

import ChplSubscribe from './subscribe';

import AppWrapper from 'app-wrapper';

function ChplSubscribeWrapper({ subscribedObjectTypeId, subscribedObjectId }) {
  return (
    <AppWrapper>
      <ChplSubscribe
        subscribedObjectTypeId={subscribedObjectTypeId}
        subscribedObjectId={subscribedObjectId}
      />
    </AppWrapper>
  );
}

export default ChplSubscribeWrapper;

ChplSubscribeWrapper.propTypes = {
  subscribedObjectTypeId: number,
  subscribedObjectId: number.isRequired,
};

ChplSubscribeWrapper.defaultProps = {
  subscribedObjectTypeId: 1,
};
