import React from 'react';
import { object } from 'prop-types';

import ChplAttestationEdit from './attestation-edit';

import ApiWrapper from 'api/api-wrapper';
import { UserWrapper } from 'components/login';

function ChplAttestationEditWrapper(props) {
  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplAttestationEdit
          {...props}
        />
      </ApiWrapper>
    </UserWrapper>
  );
  /* eslint-enable react/jsx-props-no-spreading */
}

export default ChplAttestationEditWrapper;

ChplAttestationEditWrapper.propTypes = {
  changeRequest: object.isRequired,
};
