import React from 'react';
import { object } from 'prop-types';

import ChplAttestationEdit from './attestation-edit';

import AppWrapper from 'app-wrapper';

function ChplAttestationEditWrapper(props) {
  const { changeRequest } = props;

  return (
    <AppWrapper>
      <ChplAttestationEdit
        changeRequest={changeRequest}
      />
    </AppWrapper>
  );
}

export default ChplAttestationEditWrapper;

ChplAttestationEditWrapper.propTypes = {
  changeRequest: object.isRequired, // eslint-disable-line react/forbid-prop-types
};
