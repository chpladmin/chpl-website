import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Chip,
  Typography,
} from '@material-ui/core';

import ChplEllipsis from 'components/util/chpl-ellipsis';
import { getAngularService } from 'services/angular-react-helper';
import { CompareContext } from 'shared/contexts';

function ChplCompareDisplay() {
  const $analytics = getAngularService('$analytics');
  const $localStorage = getAngularService('$localStorage');
  const $location = getAngularService('$location');
  const $rootScope = getAngularService('$rootScope');
  const { listings, removeListing } = useContext(CompareContext);

  const compareAll = () => {
    $analytics.eventTrack('Compare Listings', { category: 'Compare Widget' });
    let previously = $localStorage.previouslyCompared || [];
    listings.forEach((listing) => {
      if (previously.indexOf(listing.id) === -1) {
        previously.push(listing.id);
      };
    });
    while (previously.length > 20) {
      previously.shift();
    }
    $localStorage.previouslyCompared = previously;
    $location.url('/compare/' + listings.map((listing) => listing.id).join('&'));
    $rootScope.$broadcast('HideCompareWidget');
    $rootScope.$digest();
  };

  const removeAll = () => {
    $analytics.eventTrack('Remove all Listings', { category: 'Compare Widget' });
    listings.forEach((listing) => removeListing({
      ...listing,
      doNotTrack: true,
    }));
  };

  if (!listings || listings.length === 0) {
    return (
      <Typography>No products selected</Typography>
    );
  }

  return (
    <>
      { listings.sort((a, b) => a.name < b.name ? -1 : 1)
        .map((listing) => (
          <Chip
            key={listing.id}
            label={<ChplEllipsis text={listing.name} />}
            onDelete={() => removeListing(listing)}
          />
        ))}
      <Button
        variant="contained"
        id="compare-listings"
        onClick={compareAll}
        disabled={listings.length === 1}
      >
        Compare products
      </Button>
      <Button
        variant="contained"
        id="remove-listings"
        onClick={removeAll}
      >
        Remove all products
      </Button>
    </>
  );
}

export default ChplCompareDisplay;
