import React, { useState } from 'react';
import {
  makeStyles,
} from '@material-ui/core';

import { changeRequest as changeRequestProp } from '../../../shared/prop-types';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
});

function ChplChangeRequestAttestation(props) {
  /* eslint-disable react/destructuring-assignment */
  const [changeRequest, setChangeRequest] = useState(props.changeRequest);
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  return (
    <div className={classes.container}>
      <div>
        Current attestation
        <br />
        None
      </div>
      <div>
        Submitted attestation
        <br />
        {changeRequest.details.attestation}
      </div>
    </div>
  );
}

export default ChplChangeRequestAttestation;

ChplChangeRequestAttestation.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
