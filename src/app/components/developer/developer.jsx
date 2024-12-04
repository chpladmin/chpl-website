import React, { useEffect, useState } from 'react';
import {
  arrayOf,
  bool,
  func,
  string,
} from 'prop-types';

import ChplDeveloperEdit from './developer-edit';
import ChplDeveloperView from './developer-view';

function ChplDeveloper({
  canEdit,
  canJoin,
  canSplit,
  dispatch,
  errorMessages,
  isEditing,
  isInvalid: initialIsInvalid,
  isProcessing,
  isSplitting,
}) {
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    setIsInvalid(initialIsInvalid);
  }, [initialIsInvalid]);

  return (
    <>
      { isEditing
        && (
          <ChplDeveloperEdit
            dispatch={dispatch}
            isInvalid={isInvalid}
            isProcessing={isProcessing}
            isSplitting={isSplitting}
            errorMessages={errorMessages}
          />
        )}
      { !isEditing
        && (
          <ChplDeveloperView
            canEdit={canEdit}
            canJoin={canJoin}
            canSplit={canSplit}
            dispatch={dispatch}
            isSplitting={isSplitting}
          />
        )}
    </>
  );
}

export default ChplDeveloper;

ChplDeveloper.propTypes = {
  canEdit: func,
  canJoin: func,
  canSplit: func,
  dispatch: func,
  errorMessages: arrayOf(string),
  isEditing: bool,
  isInvalid: bool,
  isProcessing: bool,
  isSplitting: bool,
};

ChplDeveloper.defaultProps = {
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
