import React, { useEffect, useState } from 'react';
import {
  arrayOf,
  bool,
  func,
  string,
} from 'prop-types';

import ChplDeveloperEdit from './developer-edit';
import ChplDeveloperView from './developer-view';

import { AnalyticsContext, useAnalyticsContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';

function ChplDeveloper({
  canEdit,
  canJoin,
  canSplit,
  developer,
  dispatch,
  errorMessages,
  isEditing,
  isInvalid: initialIsInvalid,
  isProcessing,
  isSplitting,
}) {
  const { analytics } = useAnalyticsContext();
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    setIsInvalid(initialIsInvalid);
  }, [initialIsInvalid]);

  const data = {
    analytics: {
      ...analytics,
      category: 'Developer',
      label: developer.name,
    },
  };

  return (
    <AnalyticsContext.Provider value={data}>
      { isEditing
        && (
          <ChplDeveloperEdit
            developer={developer}
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
            developer={developer}
            dispatch={dispatch}
            isSplitting={isSplitting}
          />
        )}
    </AnalyticsContext.Provider>
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
  isProcessing: bool,
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
  isProcessing: false,
  isSplitting: false,
};
