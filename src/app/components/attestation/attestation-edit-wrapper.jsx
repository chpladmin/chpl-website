import React from 'react';
import { object } from 'prop-types';

import ChplAttestationEdit from './attestation-edit';

import ApiWrapper from 'api/api-wrapper';
import { UserWrapper } from 'components/login';

function ChplAttestationEditWrapper(props) {
  const { changeRequest } = props;

  return (
    <UserWrapper>
      <ApiWrapper>
        <ChplAttestationEdit
          changeRequest={changeRequest}
        />
      </ApiWrapper>
    </UserWrapper>
  );
}

export default ChplAttestationEditWrapper;

ChplAttestationEditWrapper.propTypes = {
  changeRequest: object.isRequired, // eslint-disable-line react/forbid-prop-types
};
