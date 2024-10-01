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
  canCancel: bool,
  canClose: bool,
  canConfirm: bool,
  canDelete: bool,
  canEdit: bool,
  canReject: bool,
  canSave: bool,
  canWithdraw: bool,
  isDisabled: bool,
  isProcessing: bool,
  showErrorAcknowledgement: bool,
  showWarningAcknowledgement: bool,
};

ChplActionBarWrapper.defaultProps = {
  errors: [],
  warnings: [],
  canCancel: true,
  canClose: false,
  canConfirm: false,
  canDelete: false,
  canEdit: false,
  canReject: false,
  canSave: true,
  canWithdraw: false,
  isDisabled: false,
  isProcessing: false,
  showErrorAcknowledgement: false,
  showWarningAcknowledgement: false,
};
