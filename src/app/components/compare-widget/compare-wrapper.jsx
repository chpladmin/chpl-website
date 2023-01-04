import React, { useEffect, useState } from 'react';
import { node } from 'prop-types';

import { getAngularService } from 'services/angular-react-helper';
import { CompareContext } from 'shared/contexts';

function CompareWrapper(props) {
  const $localStorage = getAngularService('$localStorage');
  const $rootScope = getAngularService('$rootScope');
  const { children } = props;
  const [listings, setListings] = useState([]);

  let isInWidget;

  useEffect(() => {
    setListings($localStorage?.compareWidget?.products);
  }, []);

  useEffect(() => {
    const deregisterAddWatcher = $rootScope.$on('addedListing', (evt, listing) => !isInWidget(listing) && setListings((prev) => prev.concat(listing)));
    const deregisterRemoveWatcher = $rootScope.$on('removedListing', (evt, listing) => setListings((prev) => prev.filter((l) => l.id !== listing.id)));
    return () => {
      deregisterAddWatcher();
      deregisterRemoveWatcher();
    };
  }, [$rootScope, isInWidget, setListings]);

  const addListing = (listing) => {
    $rootScope.$broadcast('addListing', {
      ...listing,
      product: listing.product.name ? listing.product.name : listing.product,
    });
    $rootScope.$broadcast('ShowCompareWidget');
    $rootScope.$digest();
  };

  isInWidget = (listing) => listings.find((l) => l.id === listing.id);

  const removeListing = (listing) => {
    $rootScope.$broadcast('removeListing', listing);
    $rootScope.$broadcast('ShowCompareWidget');
    $rootScope.$digest();
  };

  const compareState = {
    addListing,
    isInWidget,
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
