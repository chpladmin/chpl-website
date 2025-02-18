import React from 'react';
import { arrayOf, object, func } from 'prop-types';

import ChplConfirmDeveloper from './confirm-developer';

import AppWrapper from 'app-wrapper';
import { developer as developerProp } from 'shared/prop-types';

function ChplConfirmDeveloperWrapper(props) {
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <AppWrapper>
      <ChplConfirmDeveloper {...props} />
    </AppWrapper>
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplConfirmDeveloperWrapper;

ChplConfirmDeveloperWrapper.propTypes = {
  developer: developerProp.isRequired,
  developers: arrayOf(developerProp).isRequired,
  dispatch: func.isRequired,
  listing: object.isRequired, // eslint-disable-line react/forbid-prop-types
};
