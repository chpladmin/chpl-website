import React, { useEffect, useState } from 'react';
import {
  Container,
} from '@material-ui/core';
import { bool, func } from 'prop-types';

import ChplDeveloperEdit from './developer-edit';
import ChplDeveloperView from './developer-view';

import { UserWrapper } from 'components/login';
import { developer as developerPropType } from 'shared/prop-types';

function ChplDeveloper(props) {
  const {
    dispatch,
    isEditing,
    isSplitting,
  } = props;
  const [developer, setDeveloper] = useState({});
  const [isInvalid, setIsInvalid] = useState(false);

  useEffect(() => {
    setDeveloper(props.developer);
  }, [props.developer]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setIsInvalid(props.isInvalid);
  }, [props.isInvalid]); // eslint-disable-line react/destructuring-assignment

  return (
    <UserWrapper>
      <Container>
        { isEditing
          && (
            <ChplDeveloperEdit
              developer={developer}
              dispatch={dispatch}
              isInvalid={isInvalid}
              isSplitting={isSplitting}
            />
          )}
        { !isEditing
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
  isSplitting: bool,
};

ChplDeveloper.defaultProps = {
  dispatch: () => {},
  isEditing: false,
  isInvalid: false,
  isSplitting: false,
};
