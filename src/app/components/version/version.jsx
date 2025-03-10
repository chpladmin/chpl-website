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
  dispatch,
  errorMessages,
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
  dispatch: func,
  errorMessages: arrayOf(string),
  isInvalid: bool,
  isProcessing: bool,
  isSplitting: bool,
  version: object.isRequired,
};

ChplVersion.defaultProps = {
  dispatch: () => {},
  errorMessages: [],
  isInvalid: false,
  isProcessing: false,
  isSplitting: false,
};
