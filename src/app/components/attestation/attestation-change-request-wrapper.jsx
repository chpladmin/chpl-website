import React from 'react';
import { func } from 'prop-types';

import ChplAttestationChangeRequestView from './attestation-change-request-view';

import ApiWrapper from 'api/api-wrapper';
import { UserWrapper } from 'components/login';
import { developer as developerPropType } from 'shared/prop-types';

function ChplAttestationChangeRequestWrapper(props) {
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplAttestationChangeRequestView
          {...props}
        />
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplAttestationChangeRequestWrapper;

ChplAttestationChangeRequestWrapper.propTypes = {
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
};
