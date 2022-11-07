import React from 'react';
import { func } from 'prop-types';

import ChplAttestationsView from './attestations-view';

import AppWrapper from 'app-wrapper';
import { developer as developerPropType } from 'shared/prop-types';

function ChplAttestationsViewWrapper(props) {
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <AppWrapper>
      <ChplAttestationsView
        {...props}
      />
    </AppWrapper>
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplAttestationsViewWrapper;

ChplAttestationsViewWrapper.propTypes = {
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
};
