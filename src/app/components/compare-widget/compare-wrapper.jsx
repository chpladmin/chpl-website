import React, { useEffect, useState } from 'react';
import { node } from 'prop-types';

import { getAngularService } from 'services/angular-react-helper';
import { CompareContext } from 'shared/contexts';

function CompareWrapper({ children }) {
  const $localStorage = getAngularService('$localStorage');
  const [listings, setListings] = useState([]);

  useEffect(() => {
    setListings($localStorage?.compareWidget?.products ?? []);
  }, []);

  const addListing = (listing) => {
    setListings((prev) => [...prev, {
      ...listing,
      name: listing.product.name,
    }]);
  };

  const isInWidget = (listing) => listings.find((l) => l.id === listing.id);

  const removeListing = (listing) => {
    setListings((prev) => [...prev].filter((l) => l.id !== listing.id));
  };

  const compareState = {
    addListing,
    isInWidget,
    listings,
    removeListing,
  };

  return (
    <CompareContext.Provider value={compareState}>
      { children }
    </CompareContext.Provider>
  );
}

export default CompareWrapper;

CompareWrapper.propTypes = {
  children: node.isRequired,
};
