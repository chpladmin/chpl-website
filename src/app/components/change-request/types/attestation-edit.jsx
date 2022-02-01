import React from 'react';
import {
  Typography,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  submittedDetailsContainer: {
    display: 'grid',
    gap: '4px',
  },
});

function ChplChangeRequestAttestationEdit() {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div>
        <Typography gutterBottom variant="subtitle1">Current Attestation</Typography>
        TBD
      </div>
      <div className={classes.submittedDetailsContainer}>
        <Typography gutterBottom variant="subtitle1">Submitted attestation</Typography>
        TBD
      </div>
    </div>
  );
}

export default ChplChangeRequestAttestationEdit;

ChplChangeRequestAttestationEdit.propTypes = {
};
