import React from 'react';
import {
  arrayOf,
  bool,
  func,
} from 'prop-types';

import ChplCriteria from './criteria';

import AppWrapper from 'app-wrapper';
import {
  accessibilityStandard,
  certificationResult,
  resources as resourceDefinition,
  qmsStandard,
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
  certificationResults: arrayOf(certificationResult).isRequired,
  accessibilityStandards: arrayOf(accessibilityStandard),
  canEdit: bool,
  isConfirming: bool,
  hasIcs: bool,
  onSave: func,
  qmsStandards: arrayOf(qmsStandard),
  resources: resourceDefinition,
  viewAll: bool,
};

ChplCriteriaWrapper.defaultProps = {
  accessibilityStandards: [],
  canEdit: false,
  isConfirming: false,
  hasIcs: false,
  onSave: () => {},
  qmsStandards: [],
  resources: {},
  viewAll: false,
};
