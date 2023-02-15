import React, { useContext } from 'react';
import {
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import { CompareContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';

function ChplCompareButton(props) {
  const { listing } = props;
  const { addListing, isInWidget, removeListing } = useContext(CompareContext);

  const handleClick = () => (isInWidget(listing) ? removeListing(listing) : addListing(listing));

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
