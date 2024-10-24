import React from 'react';

import ChplListingEdit from './listing-edit';

import AppWrapper from 'app-wrapper';
import { ListingContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';

function ChplListingEditWrapper({ listing }) {
  const listingState = {
    listing,
  };

  return (
    <AppWrapper>
      <ListingContext.Provider value={listingState}>
        <ChplListingEdit
          listing={listing}
        />
      </ListingContext.Provider>
    </AppWrapper>
  );
}

export default ChplListingEditWrapper;

ChplListingEditWrapper.propTypes = {
  listing: listingPropType.isRequired,
};
