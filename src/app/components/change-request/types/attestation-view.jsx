import React from 'react';
import {
  Typography,
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
        <Typography gutterBottom variant="subtitle2">Current attestation</Typography>
        None
      </div>
      <div>
        <Typography gutterBottom variant="subtitle2">Submitted attestation</Typography>
        {changeRequest.details.attestation}
      </div>
    </div>
  );
}

export default ChplChangeRequestAttestationView;

ChplChangeRequestAttestationView.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
