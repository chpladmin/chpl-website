import React, { useEffect, useState } from 'react';
import {
  arrayOf,
  bool,
  func,
  object,
  string,
} from 'prop-types';

import ChplVersionEdit from './version-edit';

function ChplVersion({
  canEdit,
  canJoin,
  canSplit,
  dispatch,
  errorMessages,
  isEditing,
  isInvalid: initialIsInvalid,
  isProcessing,
  isSplitting,
  version,
}) {
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    setIsInvalid(initialIsInvalid);
  }, [initialIsInvalid]);

  return (
    <ChplVersionEdit
      dispatch={dispatch}
      isInvalid={isInvalid}
      isProcessing={isProcessing}
      isSplitting={isSplitting}
      errorMessages={errorMessages}
      version={version}
    />
  );
}

export default ChplVersion;

ChplVersion.propTypes = {
  canEdit: func,
  canJoin: func,
  canSplit: func,
  dispatch: func,
  errorMessages: arrayOf(string),
  isEditing: bool,
  isInvalid: bool,
  isProcessing: bool,
  isSplitting: bool,
  version: object.isRequired,
};

ChplVersion.defaultProps = {
  canEdit: () => false,
  canJoin: () => false,
  canSplit: () => false,
  dispatch: () => {},
  errorMessages: [],
  isEditing: false,
  isInvalid: false,
  isProcessing: false,
  isSplitting: false,
};
