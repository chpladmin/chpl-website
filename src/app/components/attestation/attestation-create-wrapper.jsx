import React from 'react';

import ChplAttestationCreate from './attestation-create';

import ApiWrapper from 'api/api-wrapper';
import { UserWrapper } from 'components/login';
import { developer as developerPropType } from 'shared/prop-types';

function ChplAttestationCreateWrapper(props) {
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplAttestationCreate
          {...props}
        />
      </ApiWrapper>
    </UserWrapper>
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplAttestationCreateWrapper;

ChplAttestationCreateWrapper.propTypes = {
  developer: developerPropType.isRequired,
};
