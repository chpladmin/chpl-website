import React from 'react';
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

function ChplChangeRequestAttestationView(props) {
  const { changeRequest } = props;
  const classes = useStyles();

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

export default ChplChangeRequestAttestationView;

ChplChangeRequestAttestationView.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
