import React, { useEffect, useState } from 'react';
import { node } from 'prop-types';
import { useQueryClient } from '@tanstack/react-query';

import { getAngularService } from 'services/angular-react-helper';
import { CmsContext } from 'shared/contexts';

function CmsWrapper({ children }) {
  const $localStorage = getAngularService('$localStorage');
  const $rootScope = getAngularService('$rootScope');
  const [listings, setListings] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    setListings($localStorage?.cmsWidget?.products ?? []);
  }, []);

  useEffect(() => {
    const deregisterAddWatcher = $rootScope.$on('cms.addedListing', (evt, listing) => setListings((prev) => prev.filter((p) => p.id !== listing.id).concat(listing)));
    const deregisterRemoveWatcher = $rootScope.$on('cms.removedListing', (evt, listing) => setListings((prev) => prev.filter((l) => l.id !== listing.id)));
    const deregisterRemoveAllWatcher = $rootScope.$on('cms.removeAll', () => setListings([]));
    return () => {
      deregisterAddWatcher();
      deregisterRemoveWatcher();
      deregisterRemoveAllWatcher();
    };
  }, [$rootScope, setListings]);

  const addListing = (listing) => {
    queryClient.invalidateQueries(['certification-ids']);
    $rootScope.$broadcast('cms.addListing', {
      ...listing,
      name: listing.product.name,
    });
    $rootScope.$broadcast('ShowCmsWidget');
    $rootScope.$digest();
  };

  const canDisplayButton = (listing) => listing.curesUpdate || listing.edition === null;

  const isInWidget = (listing) => listings.find((l) => l.id === listing.id);

  const removeListing = (listing) => {
    queryClient.invalidateQueries(['certification-ids']);
    $rootScope.$broadcast('cms.removeListing', listing);
    $rootScope.$broadcast('ShowCmsWidget');
    $rootScope.$digest();
  };

  const cmsState = {
    addListing,
    canDisplayButton,
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
