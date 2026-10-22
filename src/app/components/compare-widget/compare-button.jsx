import React from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';
import CompareArrows from '@material-ui/icons/CompareArrows';
import RemoveIcon from '@material-ui/icons/Remove';
import { useDispatch, useSelector } from 'react-redux';

import { openWidget } from 'components/action-widget/widget.slice';
import { addCompareListing, removeCompareListing } from 'components/browser/browserInfo.slice';
import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplCompareButton({ listing }) {
  const { analytics } = useAnalyticsContext();
  const dispatch = useDispatch();
  const inWidget = useSelector((state) => state.browserInfo.compare.some((l) => l.id === listing.id));
  const classes = useStyles();

  const handleClick = () => {
    eventTrack({
      ...analytics,
      event: inWidget ? 'Remove Listing from Compare Widget' : 'Add Listing to Compare Widget',
      label: listing.chplProductNumber,
      aggregationName: listing.product.name,
    });
    dispatch(inWidget ? removeCompareListing(listing) : addCompareListing(listing));
    dispatch(openWidget('compare'));
  };

  return (
    <Button
      color="secondary"
      className={inWidget ? classes.deleteButtonOutlined : ''}
      variant="contained"
      id={`toggle-compare-${listing.id}`}
      onClick={handleClick}
      endIcon={inWidget ? <RemoveIcon /> : <CompareArrows />}
    >
      Compare
    </Button>
  );
}

export default ChplCompareButton;

ChplCompareButton.propTypes = {
  listing: listingPropType.isRequired,
};
