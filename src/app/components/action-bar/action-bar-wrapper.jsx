import React from 'react';
import {
  arrayOf,
  bool,
  func,
  string,
} from 'prop-types';

import ChplActionBar from './action-bar';

import AppWrapper from 'app-wrapper';

function ChplActionBarWrapper(props) {
  return (
    <AppWrapper>
      <ChplActionBar {...props} />
    </AppWrapper>
  );
}

export default ChplActionBarWrapper;

ChplActionBarWrapper.propTypes = {
  dispatch: func.isRequired,
  errors: arrayOf(string),
  warnings: arrayOf(string),
  canConfirm: bool,
  canDelete: bool,
  canReject: bool,
  isDisabled: bool,
  showErrorAcknowledgement: bool,
  showWarningAcknowledgement: bool,
};

ChplActionBarWrapper.defaultProps = {
  errors: [],
  warnings: [],
  canConfirm: false,
  canDelete: false,
  canReject: false,
  isDisabled: false,
  showErrorAcknowledgement: false,
  showWarningAcknowledgement: false,
};
