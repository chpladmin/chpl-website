import React, { useEffect, useState } from 'react';
import { node } from 'prop-types';

import { useLocalStorage as useStorage } from 'services/storage.service';
import { getAngularService } from 'services/angular-react-helper';
import { CompareContext } from 'shared/contexts';

function CompareWrapper(props) {
  const $rootScope = getAngularService('$rootScope');
  const { children } = props;
  const [listings, setListings] = useStorage('compare-widget-listings', []);

  let addListing, isInWidget, removeListing;

  useEffect(() => {
    const deregisterAddWatcher = $rootScope.$on('addListing', addListing);
    const deregisterRemoveWatcher = $rootScope.$on('removeListing', removeListing);
    return () => {
      deregisterAddWatcher();
      deregisterRemoveWatcher();
    };
  }, [$rootScope, addListing, removeListing]);

  addListing = (listing) => !isInWidget(listing) && setListings((prev) => prev.concat(listing));

  isInWidget = (listing) => listings.find((l) => l.id === listing.id);

  removeListing = (listing) => setListings((prev) => prev.filter((l) => l.id !== listing.id));

  const compareState = {
    addListing,
    isInWidget,
    removeListing,
    listings,
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
