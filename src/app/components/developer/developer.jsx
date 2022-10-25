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
    canMerge,
    canSplit,
    demographicChangeRequestIsOn,
    developer,
    dispatch,
    errorMessages,
    isEditing,
    isMerging,
    isSplitting,
  } = props;
  const [isInvalid, setIsInvalid] = useState(false);
  const [mergingDevelopers, setMergingDevelopers] = useState([]);
  const flags = {
    demographicChangeRequestIsOn,
  };

  useEffect(() => {
    setIsInvalid(props.isInvalid);
  }, [props.isInvalid]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setMergingDevelopers(props.mergingDevelopers);
  }, [props.mergingDevelopers]); // eslint-disable-line react/destructuring-assignment

  return (
    <UserWrapper>
      <FlagContext.Provider value={flags}>
        { (isEditing || isMerging)
          && (
            <ChplDeveloperEdit
              developer={developer}
              dispatch={dispatch}
              isInvalid={isInvalid}
              isSplitting={isSplitting}
              mergingDevelopers={mergingDevelopers}
              errorMessages={errorMessages}
            />
          )}
        { !isEditing && !isMerging
          && (
            <ChplDeveloperView
              canEdit={canEdit}
              canMerge={canMerge}
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
  canMerge: bool,
  canSplit: bool,
  demographicChangeRequestIsOn: bool,
  developer: developerPropType.isRequired,
  dispatch: func,
  errorMessages: arrayOf(string),
  isEditing: bool,
  isInvalid: bool,
  isMerging: bool,
  isSplitting: bool,
  mergingDevelopers: arrayOf(developerPropType),
};

ChplDeveloper.defaultProps = {
  canEdit: false,
  canMerge: false,
  canSplit: false,
  demographicChangeRequestIsOn: false,
  dispatch: () => {},
  errorMessages: [],
  isEditing: false,
  isInvalid: false,
  isMerging: false,
  isSplitting: false,
  mergingDevelopers: [],
};
