import React from 'react';

import ChplAttestationCreate from './attestation-create';

import AppWrapper from 'app-wrapper';
import { developer as developerPropType } from 'shared/prop-types';

function ChplAttestationCreateWrapper(props) {
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <AppWrapper>
      <ChplAttestationCreate
        {...props}
      />
    </AppWrapper>
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplAttestationCreateWrapper;

ChplAttestationCreateWrapper.propTypes = {
  developer: developerPropType.isRequired,
};
