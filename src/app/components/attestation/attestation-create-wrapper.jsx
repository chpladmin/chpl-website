import React from 'react';

import ChplAttestationCreate from './attestation-create';

import ApiWrapper from 'api/api-wrapper';
import { UserWrapper } from 'components/login';

function ChplAttestationCreateWrapper() {
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplAttestationCreate />
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplAttestationCreateWrapper;

ChplAttestationCreateWrapper.propTypes = {
};
