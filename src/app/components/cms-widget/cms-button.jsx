import React, { useContext } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

import { eventTrack } from 'services/analytics.service';
import {
  CmsContext,
  CompareContext,
  FlagContext,
  useAnalyticsContext,
} from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

function ChplCmsButton({ listing }) {
  const { analytics } = useAnalyticsContext();
  const {
    addListing,
    canDisplayButton,
    isInWidget,
    removeListing,
    setIsOpen,
  } = useContext(CmsContext);
  const { setIsOpen: setCompareIsOpen } = useContext(CompareContext);
  const { cmsDisabledIsOn } = useContext(FlagContext);

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
    setIsOpen(true);
    setCompareIsOpen(false);
  };

  if (!canDisplayButton(listing) || cmsDisabledIsOn) {
    return null;
  }

  return (
    <Button
      color="secondary"
      sx={isInWidget(listing) ? utilStyles.deleteButtonOutlined : undefined}
      variant="contained"
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
