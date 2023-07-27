import React from 'react';
import {
  bool,
  func,
} from 'prop-types';

import ChplCriteria from './criteria';

import AppWrapper from 'app-wrapper';
import {
  listing as listingPropType,
  resources as resourceDefinition,
} from 'shared/prop-types';

function ChplCriteriaWrapper(props) {
  return (
    <AppWrapper>
      <ChplCriteria {...props} />
    </AppWrapper>
  );
}

export default ChplCriteriaWrapper;

ChplCriteriaWrapper.propTypes = {
  canEdit: bool,
  hasIcs: bool,
  isConfirming: bool,
  listing: listingPropType.isRequired,
  onSave: func,
  resources: resourceDefinition,
  viewAll: bool,
};

ChplCriteriaWrapper.defaultProps = {
  canEdit: false,
  hasIcs: false,
  isConfirming: false,
  onSave: () => {},
  resources: {},
  viewAll: false,
};
