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
  canEdit = () => false,
  canJoin = () => false,
  canSplit = () => false,
  dispatch = () => {},
  errorMessages = [],
  isEditing = false,
  isInvalid: initialIsInvalid = false,
  isProcessing = false,
  isSplitting = false,
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
