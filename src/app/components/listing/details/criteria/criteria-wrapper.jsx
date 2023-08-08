import React from 'react';
import {
  bool,
  func,
} from 'prop-types';

import ChplCriteria from './criteria';

import AppWrapper from 'app-wrapper';
import ListingWrapper from 'components/listing/listing-wrapper';
import {
  listing as listingPropType,
  resources as resourceDefinition,
} from 'shared/prop-types';

function ChplCriteriaWrapper(props) {
  return (
    <AppWrapper>
      <ListingWrapper>
        <ChplCriteria {...props} />
      </ListingWrapper>
    </AppWrapper>
  );
}

export default ChplCriteriaWrapper;

ChplCriteriaWrapper.propTypes = {
  hasIcs: bool,
  isConfirming: bool,
  isEditing: bool,
  listing: listingPropType.isRequired,
  onSave: func,
  resources: resourceDefinition,
  viewAll: bool,
};

ChplCriteriaWrapper.defaultProps = {
  hasIcs: false,
  isConfirming: false,
  isEditing: false,
  onSave: () => {},
  resources: {},
  viewAll: false,
};
