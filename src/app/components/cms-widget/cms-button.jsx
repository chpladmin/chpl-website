import React, { useContext } from 'react';
import {
  Button,
  ButtonGroup,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { node } from 'prop-types';

import { CmsContext } from 'shared/contexts';
import { listing as listingPropType } from 'shared/prop-types';

function ChplCmsButton(props) {
  const { children, listing } = props;
  const { addListing, isInWidget, removeListing } = useContext(CmsContext);

  const handleClick = () => (isInWidget(listing) ? removeListing(listing) : addListing(listing));

  return (
    <ButtonGroup>
      { children }
      <Button
        variant="contained"
        size="small"
        color="secondary"
        id={`toggle-cms-${listing.id}`}
        onClick={handleClick}
        endIcon={isInWidget(listing) ? <RemoveIcon /> : <AddIcon />}
      >
        Cert ID
      </Button>
    </ButtonGroup>
  );
}

export default ChplCmsButton;

ChplCmsButton.propTypes = {
  listing: listingPropType.isRequired,
  children: node,
};

ChplCmsButton.defaultProps = {
  children: undefined,
};
