import React from 'react';
import { string } from 'prop-types';

import ChplUnsubscribeAll from './unsubscribe-all';

function ChplUnsubscribeAllWrapper({ hash }) {
  return (
    <>
      <ChplUnsubscribeAll
        hash={hash}
      />
    </>
  );
}

export default ChplUnsubscribeAllWrapper;

ChplUnsubscribeAllWrapper.propTypes = {
  hash: string.isRequired,
};
