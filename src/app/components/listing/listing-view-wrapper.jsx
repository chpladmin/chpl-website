import React from 'react';
import { bool } from 'prop-types';

import ChplListingView from './listing-view';

import AppWrapper from 'app-wrapper';
import { listing as listingPropType } from 'shared/prop-types';

function ChplListingViewWrapper({ isConfirming, listing }) {
  return (
    <AppWrapper>
      <ChplListingView
        isConfirming={isConfirming}
        listing={listing}
      />
    </AppWrapper>
  );
}

export default ChplListingViewWrapper;

ChplListingViewWrapper.propTypes = {
  isConfirming: bool,
  listing: listingPropType.isRequired,
};

ChplListingViewWrapper.defaultProps = {
  isConfirming: false,
};
