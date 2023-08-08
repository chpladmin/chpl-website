import React, { useEffect, useState } from 'react';
import { element } from 'prop-types';

import { ListingContext } from 'shared/contexts';

function ListingWrapper({ children }) {
  const [listing, setListing] = useState({});

  const listingState = {
    listing,
    setListing,
  };

  return (
    <ListingContext.Provider value={listingState}>
      {children}
    </ListingContext.Provider>
  );
}

export default ListingWrapper;

ListingWrapper.propTypes = {
  children: element.isRequired,
};
