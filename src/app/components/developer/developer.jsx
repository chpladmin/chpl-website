import React, { useEffect, useState } from 'react';
import { arrayOf, bool, func } from 'prop-types';

import ChplDeveloperEdit from './developer-edit';
import ChplDeveloperView from './developer-view';

import { UserWrapper } from 'components/login';
import { developer as developerPropType } from 'shared/prop-types';

function ChplDeveloper(props) {
  const {
    canEdit,
    canMerge,
    canSplit,
    developer,
    dispatch,
    isEditing,
    isMerging,
    isSplitting,
  } = props;
  const [isInvalid, setIsInvalid] = useState(false);
  const [mergingDevelopers, setMergingDevelopers] = useState([]);

  useEffect(() => {
    setIsInvalid(props.isInvalid);
  }, [props.isInvalid]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setMergingDevelopers(props.mergingDevelopers);
  }, [props.mergingDevelopers]); // eslint-disable-line react/destructuring-assignment

  return (
    <UserWrapper>
      { (isEditing || isMerging)
        && (
          <ChplDeveloperEdit
            developer={developer}
            dispatch={dispatch}
            isInvalid={isInvalid}
            isSplitting={isSplitting}
            mergingDevelopers={mergingDevelopers}
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
    </UserWrapper>
  );
}

export default ChplDeveloper;

ChplDeveloper.propTypes = {
  canEdit: bool,
  canMerge: bool,
  canSplit: bool,
  developer: developerPropType.isRequired,
  dispatch: func,
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
  dispatch: () => {},
  isEditing: false,
  isInvalid: false,
  isMerging: false,
  isSplitting: false,
  mergingDevelopers: [],
};
