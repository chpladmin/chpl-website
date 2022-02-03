import React, { useContext, useEffect, useState } from 'react';
import {
  arrayOf,
  func,
  string,
} from 'prop-types';
import {
  Container,
  Paper,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';

import ChplDeveloperEdit from './developer-edit';
import ChplDeveloperView from './developer-view';

import { UserWrapper } from 'components/login';
import { developer as developerPropType } from 'shared/prop-types';

function ChplDeveloper(props) {
  const [developer, setDeveloper] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setDeveloper(props.developer);
  }, [props.developer]);

  const handleDispatch = (action, data) => {
    switch (action) {
      case 'cancel':
        setIsEditing(false);
        break;
      case 'edit':
        setIsEditing(true);
        break;
      case 'save':
        // todo
        break;
        // no default
    }
  };

  return (
    <UserWrapper>
      <Container>
        { isEditing
          && (
            <ChplDeveloperEdit
              developer={developer}
              dispatch={handleDispatch}
            />
          )}
        { !isEditing
          && (
            <ChplDeveloperView
              developer={developer}
              dispatch={handleDispatch}
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
};
