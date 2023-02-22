import React, { useContext } from 'react';
import {
  Button,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

import { CmsContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';

function ChplCmsButton(props) {
  const { listing } = props;
  const {
    addListing,
    canDisplayButton,
    isInWidget,
    removeListing,
  } = useContext(CmsContext);

  const handleClick = () => (isInWidget(listing) ? removeListing(listing) : addListing(listing));

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
