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
  const { dispatch } = props;
  const [developer, setDeveloper] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setDeveloper(props.developer);
  }, [props.developer]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setIsEditing(props.isEditing);
  }, [props.isEditing]); // eslint-disable-line react/destructuring-assignment

  return (
    <UserWrapper>
      <Container>
        { isEditing
          && (
            <ChplDeveloperEdit
              developer={developer}
              dispatch={dispatch}
            />
          )}
        { !isEditing
          && (
            <ChplDeveloperView
              developer={developer}
              dispatch={dispatch}
            />
          )}
      </Container>
    </UserWrapper>
  );
}

export default ChplDeveloper;

ChplDeveloper.propTypes = {
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
  isEditing: bool,
};

ChplDeveloper.defaultProps = {
  isEditing: false,
};
