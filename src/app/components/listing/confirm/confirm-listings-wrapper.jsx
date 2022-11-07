import React from 'react';
import { func } from 'prop-types';

import ChplConfirmListings from './confirm-listings';

import AppWrapper from 'app-wrapper';

function ChplConfirmListingsWrapper(props) {
  const { onProcess } = props;

  return (
    <AppWrapper>
      <ChplConfirmListings
        onProcess={onProcess}
      />
    </AppWrapper>
  );
}

export default ChplConfirmListingsWrapper;

ChplConfirmListingsWrapper.propTypes = {
  onProcess: func.isRequired,
};
