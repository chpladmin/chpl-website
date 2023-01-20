import React, { useEffect, useState } from 'react';
import { node } from 'prop-types';

import { getAngularService } from 'services/angular-react-helper';
import { CmsContext } from 'shared/contexts';

function CmsWrapper(props) {
  const $localStorage = getAngularService('$localStorage');
  const $rootScope = getAngularService('$rootScope');
  const { children } = props;
  const [listings, setListings] = useState([]);

  /*
    // figure out how to / what to load from localstorage
  useEffect(() => {
    setListings($localStorage?.cmsWidget?.products);
  }, []);
  */

  useEffect(() => {
    const deregisterAddWatcher = $rootScope.$on('addedListing', (evt, listing) => setListings((prev) => prev.filter((p) => p.id !== listing.id).concat(listing)));
    const deregisterRemoveWatcher = $rootScope.$on('removedListing', (evt, listing) => setListings((prev) => prev.filter((l) => l.id !== listing.id)));
    return () => {
      deregisterAddWatcher();
      deregisterRemoveWatcher();
    };
  }, [$rootScope, setListings]);

  const addListing = (listing) => {
    $rootScope.$broadcast('addListing', {
      ...listing,
      product: listing.product.name ? listing.product.name : listing.product,
    });
    $rootScope.$broadcast('ShowCmsWidget');
    $rootScope.$digest();
  };

  const isInWidget = (listing) => listings.find((l) => l.id === listing.id);

  const removeListing = (listing) => {
    $rootScope.$broadcast('removeListing', listing);
    $rootScope.$broadcast('ShowCmsWidget');
    $rootScope.$digest();
  };

  const cmsState = {
    addListing,
    isInWidget,
    listings,
    removeListing,
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
