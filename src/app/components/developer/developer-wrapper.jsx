import React from 'react';
import {
  arrayOf,
  bool,
  func,
  string,
} from 'prop-types';

import ChplDeveloper from './developer';

import AppWrapper from 'app-wrapper';
import { developer as developerPropType } from 'shared/prop-types';

function ChplDeveloperWrapper({
  canEdit,
  canJoin,
  canSplit,
  developer,
  dispatch,
  errorMessages,
  isEditing,
  isInvalid,
  isProcessing,
  isSplitting,
}) {
  return (
    <AppWrapper>
      <ChplDeveloper
        canEdit={canEdit}
        canJoin={canJoin}
        canSplit={canSplit}
        developer={developer}
        dispatch={dispatch}
        errorMessages={errorMessages}
        isEditing={isEditing}
        isInvalid={isInvalid}
        isProcessing={isProcessing}
        isSplitting={isSplitting}
      />
    </AppWrapper>
  );
}

export default ChplDeveloperWrapper;

ChplDeveloperWrapper.propTypes = {
  canEdit: bool,
  canJoin: bool,
  canSplit: bool,
  developer: developerPropType.isRequired,
  dispatch: func,
  errorMessages: arrayOf(string),
  isEditing: bool,
  isInvalid: bool,
  isProcessing: bool,
  isSplitting: bool,
};

ChplDeveloperWrapper.defaultProps = {
  canEdit: false,
  canJoin: false,
  canSplit: false,
  dispatch: () => {},
  errorMessages: [],
  isEditing: false,
  isInvalid: false,
  isProcessing: false,
  isSplitting: false,
};
