import React, { useEffect, useState } from 'react';
import { bool, func, string } from 'prop-types';

import ChplListingEdit from './listing-edit';

import AppWrapper from 'app-wrapper';
import { ListingContext } from 'shared/contexts';
import { resources as resourcesPropType, listing as listingPropType } from 'shared/prop-types';

function ChplListingEditWrapper({
  listing: initialListing,
  resources,
  showFormErrors,
  workType,
}) {
  const [listing, setListing] = useState(undefined);

  useEffect(() => {
    setListing(initialListing);
  }, []);

  const handle = (listing) => {
    console.log(listing);
  };

  const listingState = {
    listing,
    setListing,
  };

  return (
    <AppWrapper>
      <ListingContext.Provider value={listingState}>
        <ChplListingEdit
          onChange={handle}
          resources={resources}
          showFormErrors={showFormErrors}
          workType={workType} />
      </ListingContext.Provider>
    </AppWrapper>
  );
}

export default ChplListingEditWrapper;

ChplListingEditWrapper.propTypes = {
  listing: listingPropType.isRequired,
  resources: resourcesPropType.isRequired,
  showFormErrors: bool.isRequired,
  workType: string.isRequired,
};
