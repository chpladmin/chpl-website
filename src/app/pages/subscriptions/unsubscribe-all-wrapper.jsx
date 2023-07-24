import React from 'react';
import { string } from 'prop-types';

import ChplUnsubscribeAll from './unsubscribe-all';

import AppWrapper from 'app-wrapper';

function ChplUnsubscribeAllWrapper({ hash }) {
  return (
    <AppWrapper>
      <ChplUnsubscribeAll
        hash={hash}
      />
    </AppWrapper>
  );
}

export default ChplUnsubscribeAllWrapper;

ChplUnsubscribeAllWrapper.propTypes = {
  hash: string.isRequired,
};
