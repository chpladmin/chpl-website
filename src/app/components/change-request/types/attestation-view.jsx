import React from 'react';
import {
} from '@material-ui/core';

import ChplAttestationView from 'components/attestation/attestation-view';
import { changeRequest as changeRequestProp } from 'shared/prop-types';

function ChplChangeRequestAttestationView(props) {
  const { changeRequest } = props;

  return (
    <ChplAttestationView
      attestations={changeRequest.details}
    />
  );
}

export default ChplChangeRequestAttestationView;

ChplChangeRequestAttestationView.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
