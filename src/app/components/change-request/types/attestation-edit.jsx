import React from 'react';
import {
} from '@material-ui/core';

import ChplAttestationView from 'components/attestation/attestation-view';
import { changeRequest as changeRequestProp } from 'shared/prop-types';

function ChplChangeRequestAttestationEdit(props) {
  const { changeRequest } = props;

  return (
    <ChplAttestationView
      attestations={changeRequest.details}
    />
  );
}

export default ChplChangeRequestAttestationEdit;

ChplChangeRequestAttestationEdit.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
