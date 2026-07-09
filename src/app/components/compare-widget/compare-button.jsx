import React, { useContext } from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';
import CompareArrows from '@material-ui/icons/CompareArrows';
import RemoveIcon from '@material-ui/icons/Remove';

import { eventTrack } from 'services/analytics.service';
import { CmsContext, CompareContext, useAnalyticsContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplCompareButton({ listing }) {
  const { analytics } = useAnalyticsContext();
  const { setIsOpen: setCmsIsOpen } = useContext(CmsContext);
  const {
    addListing,
    isInWidget,
    removeListing,
    setIsOpen,
  } = useContext(CompareContext);
  const classes = useStyles();

  const handleClick = () => {
    eventTrack({
      ...analytics,
      event: isInWidget(listing) ? 'Remove Listing from Compare Widget' : 'Add Listing to Compare Widget',
      label: listing.chplProductNumber,
      aggregationName: listing.product.name,
    });
    if (isInWidget(listing)) {
      removeListing(listing);
    } else {
      addListing(listing);
    }
    setIsOpen(true);
    setCmsIsOpen(false);
  };

  return (
    <Button
      color="secondary"
      className={isInWidget(listing) ? classes.deleteButtonOutlined : ''}
      variant="contained"
      id={`toggle-compare-${listing.id}`}
      onClick={handleClick}
      endIcon={isInWidget(listing) ? <RemoveIcon /> : <CompareArrows />}
    >
      Compare
    </Button>
  );
}

export default ChplCompareButton;

ChplCompareButton.propTypes = {
  listing: listingPropType.isRequired,
};
