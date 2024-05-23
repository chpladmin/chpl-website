import React, { useEffect, useState } from 'react';
import {
  arrayOf,
  bool,
  func,
  string,
} from 'prop-types';

import ChplDeveloperEdit from './developer-edit';
import ChplDeveloperView from './developer-view';

import AppWrapper from 'app-wrapper';
import { developer as developerPropType } from 'shared/prop-types';

function ChplDeveloper(props) {
  const {
    canEdit,
    canJoin,
    canSplit,
    developer,
    dispatch,
    errorMessages,
    isEditing,
    isInvalid: initialIsInvalid,
    isSplitting,
  } = props;
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    setIsInvalid(initialIsInvalid);
  }, [initialIsInvalid]);

  return (
    <AppWrapper>
      { isEditing
        && (
          <ChplDeveloperEdit
            developer={developer}
            dispatch={dispatch}
            isInvalid={isInvalid}
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
            developer={developer}
            dispatch={dispatch}
            isSplitting={isSplitting}
          />
        )}
    </AppWrapper>
  );
}

export default ChplDeveloper;

ChplDeveloper.propTypes = {
  canEdit: bool,
  canJoin: bool,
  canSplit: bool,
  developer: developerPropType.isRequired,
  dispatch: func,
  errorMessages: arrayOf(string),
  isEditing: bool,
  isInvalid: bool,
  isSplitting: bool,
};

ChplDeveloper.defaultProps = {
  canEdit: false,
  canJoin: false,
  canSplit: false,
  dispatch: () => {},
  errorMessages: [],
  isEditing: false,
  isInvalid: false,
  isSplitting: false,
};
