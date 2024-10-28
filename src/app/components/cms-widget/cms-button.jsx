import React, { useContext } from 'react';
import {
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import { eventTrack } from 'services/analytics.service';
import { CmsContext, useAnalyticsContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';

function ChplCmsButton({ listing }) {
  const { analytics } = useAnalyticsContext();
  const {
    addListing,
    canDisplayButton,
    isInWidget,
    removeListing,
  } = useContext(CmsContext);

  const handleClick = () => {
    eventTrack({
      ...analytics,
      event: isInWidget(listing) ? 'Remove Listing from CMS ID Widget' : 'Add Listing to CMS ID Widget',
      label: listing.chplProductNumber,
      aggregationName: listing.product.name,
    });
    if (isInWidget(listing)) {
      removeListing(listing);
    } else {
      addListing(listing);
    }
  };

  if (!canDisplayButton(listing)) {
    return null;
  }

  return (
    <Button
      color="secondary"
      variant="contained"
      size="small"
      id={`toggle-cms-${listing.id}`}
      onClick={handleClick}
      endIcon={isInWidget(listing) ? <RemoveIcon /> : <AddIcon />}
    >
      Cert ID
    </Button>
  );
}

export default ChplCmsButton;

ChplCmsButton.propTypes = {
  listing: listingPropType.isRequired,
};
