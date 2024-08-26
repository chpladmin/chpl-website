import React, { useContext } from 'react';
import {
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import { eventTrack } from 'services/analytics.service';
import { CompareContext, UserContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';

function ChplCompareButton(props) {
  const { listing } = props;
  const { addListing, isInWidget, removeListing } = useContext(CompareContext);
  const { user } = useContext(UserContext);

  const handleClick = () => {
    eventTrack({
      event: isInWidget(listing) ? 'Remove Listing from Compare Widget' : 'Add Listing to Compare Widget',
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
