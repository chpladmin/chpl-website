import React, { useContext } from 'react';
import {
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import { eventTrack } from 'services/analytics.service';
import { CompareContext, useAnalyticsContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';

function ChplCompareButton({ listing }) {
  const { analytics } = useAnalyticsContext();
  const { addListing, isInWidget, removeListing } = useContext(CompareContext);

  const handleClick = () => {
    eventTrack({
      event: isInWidget(listing) ? 'Remove Listing from Compare Widget' : 'Add Listing to Compare Widget',
      category: analytics.category,
      label: listing.chplProductNumber,
      aggregationName: listing.product.name,
      group: analytics.group,
    });
    if (isInWidget(listing)) {
      removeListing(listing);
    } else {
      addListing(listing);
    }
  };

  return (
    <Button
      color="secondary"
      variant="contained"
      size="small"
      id={`toggle-compare-${listing.id}`}
      onClick={handleClick}
      endIcon={isInWidget(listing) ? <RemoveIcon /> : <AddIcon />}
    >
      Compare
    </Button>
  );
}

export default ChplCompareButton;

ChplCompareButton.propTypes = {
  listing: listingPropType.isRequired,
};
