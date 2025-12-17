import React from 'react';
import { object } from 'prop-types';

import ChplConfirmListing from './confirm-listing';

import AppWrapper from 'app-wrapper';

function ChplConfirmListingWrapper({ listing }) {
  return (
    <AppWrapper>
      <ChplConfirmListing
        listing={listing}
      />
    </AppWrapper>
  );
}

export default ChplConfirmListingWrapper;

ChplConfirmListingWrapper.propTypes = {
  listing: object,
};
