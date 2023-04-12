import React, { useEffect, useState } from 'react';
import {
  arrayOf,
  bool,
  func,
  string,
} from 'prop-types';

import ChplDeveloperEdit from './developer-edit';
import ChplDeveloperView from './developer-view';

import { UserWrapper } from 'components/login';
import { FlagContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';

function ChplDeveloper(props) {
  const {
    canEdit,
    canJoin,
    canSplit,
    demographicChangeRequestIsOn,
    developer,
    dispatch,
    errorMessages,
    isEditing,
    isSplitting,
  } = props;
  const [isInvalid, setIsInvalid] = useState(false);
  const flags = {
    demographicChangeRequestIsOn,
  };

  useEffect(() => {
    setIsInvalid(props.isInvalid);
  }, [props.isInvalid]); // eslint-disable-line react/destructuring-assignment

  return (
    <UserWrapper>
      <FlagContext.Provider value={flags}>
        { (isEditing)
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
      </FlagContext.Provider>
    </UserWrapper>
  );
}

export default ChplDeveloper;

ChplDeveloper.propTypes = {
  canEdit: bool,
  canJoin: bool,
  canSplit: bool,
  demographicChangeRequestIsOn: bool,
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
  demographicChangeRequestIsOn: false,
  dispatch: () => {},
  errorMessages: [],
  isEditing: false,
  isInvalid: false,
  isSplitting: false,
};
