import React, { useEffect, useState } from 'react';
import {
  Container,
} from '@material-ui/core';
import { arrayOf, bool, func } from 'prop-types';

import ChplDeveloperEdit from './developer-edit';
import ChplDeveloperView from './developer-view';

import { UserWrapper } from 'components/login';
import { developer as developerPropType } from 'shared/prop-types';

function ChplDeveloper(props) {
  const {
    dispatch,
    isEditing,
    isMerging,
    isSplitting,
  } = props;
  const [developer, setDeveloper] = useState({});
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
      <Container>
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
              developer={developer}
              dispatch={dispatch}
              isSplitting={isSplitting}
            />
          )}
      </Container>
    </UserWrapper>
  );
}

export default ChplDeveloper;

ChplDeveloper.propTypes = {
  developer: developerPropType.isRequired,
  dispatch: func,
  isEditing: bool,
  isInvalid: bool,
  isMerging: bool,
  isSplitting: bool,
  mergingDevelopers: arrayOf(developerPropType),
};

ChplDeveloper.defaultProps = {
  dispatch: () => {},
  isEditing: false,
  isInvalid: false,
  isMerging: false,
  isSplitting: false,
  mergingDevelopers: [],
};
