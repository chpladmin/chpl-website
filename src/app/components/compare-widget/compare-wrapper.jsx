import React, { useState } from 'react';
import { node } from 'prop-types';

import { useLocalStorage } from 'services/storage.service';
import { CompareContext } from 'shared/contexts';

function CompareWrapper({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [listings, setListings] = useLocalStorage('compare', []);

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
    isOpen,
    listings,
    removeListing,
    setIsOpen,
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
