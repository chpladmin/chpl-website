import React, { useContext, useEffect, useState } from 'react';
import { node } from 'prop-types';

import { getAngularService } from 'services/angular-react-helper';
import { CmsContext, FlagContext } from 'shared/contexts';

function CmsWrapper(props) {
  const $localStorage = getAngularService('$localStorage');
  const $rootScope = getAngularService('$rootScope');
  const { children } = props;
  const { isOn } = useContext(FlagContext);
  const [cannotGenerate15EIsOn, setCannotGenerate15EIsOn] = useState(false);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    setListings($localStorage?.cmsWidget?.products ?? []);
  }, []);

  useEffect(() => {
    setCannotGenerate15EIsOn(isOn('cannot-generate-15e'));
  }, [isOn]);

  useEffect(() => {
    const deregisterAddWatcher = $rootScope.$on('cms.addedListing', (evt, listing) => setListings((prev) => prev.filter((p) => p.id !== listing.id).concat(listing)));
    const deregisterRemoveWatcher = $rootScope.$on('cms.removedListing', (evt, listing) => setListings((prev) => prev.filter((l) => l.id !== listing.id)));
    return () => {
      deregisterAddWatcher();
      deregisterRemoveWatcher();
    };
  }, [$rootScope, setListings]);

  const addListing = (listing) => {
    $rootScope.$broadcast('cms.addListing', {
      ...listing,
      product: listing.product.name ? listing.product.name : listing.product,
    });
    $rootScope.$broadcast('ShowCmsWidget');
    $rootScope.$digest();
  };

  const canDisplayButton = (listing) => listing.curesUpdate
        || (!cannotGenerate15EIsOn && listing.edition.name === '2015');

  const isInWidget = (listing) => listings.find((l) => l.id === listing.id);

  const removeListing = (listing) => {
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
