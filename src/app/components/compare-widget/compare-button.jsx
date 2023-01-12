import React, { useContext } from 'react';
import {
  Button,
  ButtonGroup,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { node } from 'prop-types';

import { CompareContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';

function ChplCompareButton(props) {
  const { children, listing } = props;
  const { addListing, isInWidget, removeListing } = useContext(CompareContext);

  const handleClick = () => (isInWidget(listing) ? removeListing(listing) : addListing(listing));

  return (
    <ButtonGroup>
      { children }
      <Button
        variant="contained"
        size="small"
        color="secondary"
        id={`toggle-compare-${listing.id}`}
        onClick={handleClick}
        endIcon={isInWidget(listing) ? <RemoveIcon /> : <AddIcon />}
      >
        Compare
      </Button>
    </ButtonGroup>
  );
}

export default ChplCompareButton;

ChplCompareButton.propTypes = {
  listing: listingPropType.isRequired,
  children: node,
};

ChplCompareButton.defaultProps = {
  children: undefined,
};
