import React, { useContext } from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import { eventTrack } from 'services/analytics.service';
import {
  CmsContext,
  CompareContext,
  FlagContext,
  useAnalyticsContext,
} from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplCmsButton({ listing }) {
  const classes = useStyles();
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
      className={isInWidget(listing) ? classes.deleteButtonOutlined : ''}
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
