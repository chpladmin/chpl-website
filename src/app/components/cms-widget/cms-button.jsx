import React, { useContext } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { oneOf } from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import { openWidget } from 'components/action-widget/widget.slice';
import { addCmsListing, removeCmsListing } from 'components/browser/browserInfo.slice';
import { eventTrack } from 'services/analytics.service';
import { canAddToCms } from 'services/listing.service';
import { FlagContext, useAnalyticsContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

function ChplCmsButton({ listing, size = 'medium' }) {
  const { analytics } = useAnalyticsContext();
  const { cmsDisabledIsOn } = useContext(FlagContext);
  const dispatch = useDispatch();
  const inWidget = useSelector((state) => state.browserInfo.cms.some((l) => l.id === listing.id));

  const handleClick = () => {
    eventTrack({
      ...analytics,
      event: inWidget ? 'Remove Listing from CMS ID Widget' : 'Add Listing to CMS ID Widget',
      label: listing.chplProductNumber,
      aggregationName: listing.product.name,
    });
    dispatch(inWidget ? removeCmsListing(listing) : addCmsListing(listing));
    dispatch(openWidget('cms'));
  };

  if (!canAddToCms(listing) || cmsDisabledIsOn) {
    return null;
  }

  return (
    <Button
      color="secondary"
      sx={inWidget ? utilStyles.deleteButtonOutlined : undefined}
      variant="contained"
      size={size}
      id={`toggle-cms-${listing.id}`}
      onClick={handleClick}
      endIcon={inWidget ? <RemoveIcon /> : <AddIcon />}
    >
      Cert ID
    </Button>
  );
}

export default ChplCmsButton;

ChplCmsButton.propTypes = {
  listing: listingPropType.isRequired,
  size: oneOf(['small', 'medium', 'large']),
};
