import React, { useState } from 'react';
import { node } from 'prop-types';
import { useQueryClient } from '@tanstack/react-query';

import { useLocalStorage } from 'services/storage.service';
import { CmsContext } from 'shared/contexts';

function CmsWrapper({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [listings, setListings] = useLocalStorage('cms', []);
  const queryClient = useQueryClient();

  const addListing = (listing) => {
    setListings((prev) => [...prev, {
      ...listing,
      name: listing.product.name,
    }]);
    queryClient.invalidateQueries(['certification-ids']);
  };

  const canDisplayButton = (listing) => listing.curesUpdate || listing.edition === null;

  const isInWidget = (listing) => listings.find((l) => l.id === listing.id);

  const removeListing = (listing) => {
    setListings((prev) => [...prev].filter((l) => l.id !== listing.id));
    queryClient.invalidateQueries(['certification-ids']);
  };

  const cmsState = {
    addListing,
    canDisplayButton,
    isInWidget,
    isOpen,
    listings,
    removeListing,
    setIsOpen,
  };

  return (
    <CmsContext.Provider value={cmsState}>
      { children }
    </CmsContext.Provider>
  );
}

export default CmsWrapper;

CmsWrapper.propTypes = {
  children: node.isRequired,
};
