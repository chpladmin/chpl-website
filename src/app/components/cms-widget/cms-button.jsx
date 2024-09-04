import React, { useContext } from 'react';
import {
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import { eventTrack } from 'services/analytics.service';
import { CmsContext, UserContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';

function ChplCmsButton(props) {
  const { listing } = props;
  const {
    addListing,
    canDisplayButton,
    isInWidget,
    removeListing,
  } = useContext(CmsContext);
  const { user } = useContext(UserContext);

  const handleClick = () => {
    eventTrack({
      event: isInWidget(listing) ? 'Remove Listing from CMS ID Widget' : 'Add Listing to CMS ID Widget',
      category: 'Listing Details',
      label: listing.chplProductNumber,
      aggregationName: listing.product.name,
      group: user?.role,
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
