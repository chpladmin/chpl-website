import React from 'react';
import {
  ThemeProvider,
} from '@material-ui/core';
import {
  arrayOf, bool, func, string,
} from 'prop-types';

import ChplActionBar from './action-bar';

import theme from 'themes/theme';

function ChplActionBarWrapper(props) {
  return (
    <ThemeProvider theme={theme}>
      <ChplActionBar {...props} />
    </ThemeProvider>
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
