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

import { UserContext } from 'shared/contexts';
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
    <UserContext>
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
    </UserContext>
  );
}

export default ChplDeveloper;

ChplDeveloper.propTypes = {
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
};
