import React from 'react';

import ChplAttestationCreate from './attestation-create';

import ApiWrapper from 'api/api-wrapper';
import { UserWrapper } from 'components/login';
import { developer as developerPropType } from 'shared/prop-types';

function ChplAttestationCreateWrapper(props) {
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplAttestationCreate
          {...props}
        />
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplAttestationCreateWrapper;

ChplAttestationCreateWrapper.propTypes = {
  developer: developerPropType.isRequired,
};
