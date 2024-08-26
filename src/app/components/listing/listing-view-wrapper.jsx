import React from 'react';
import { bool } from 'prop-types';

import ChplListingView from './listing-view';

import AppWrapper from 'app-wrapper';
import { ListingContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';

function ChplListingViewWrapper({ isConfirming, listing }) {
  const listingState = {
    listing,
  };

  return (
    <AppWrapper>
      <ListingContext.Provider value={listingState}>
        <ChplListingView
          isConfirming={isConfirming}
          listing={listing}
        />
      </ListingContext.Provider>
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
