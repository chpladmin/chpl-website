import React, { useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  FormControlLabel,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import { func, object } from 'prop-types';

import theme from '../../themes/theme';

function ChplAttestationChangeRequest(props) {
  const [attestation, setAttestation] = useState(false);
  const [developer] = useState(props.developer);

  const createAttestationChangeRequest = () => {
    const request = { attestation: Date.now().toString() };
    props.dispatch(request);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardHeader title="Attestations" />
        <CardContent>
          <Typography variant="body1">
            By checking this box, I attest that I am authorized to submit the Attestations related to Conditions of Certification on behalf of { developer.name }.
          </Typography>
          <FormControlLabel
            label="I attest"
            control={<Checkbox
                       name="attest"
                       value="attest"
                       onChange={() => setAttestation(!attestation)} checked={attestation}
                     />}
          />
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            id="submit-attestation-change-request-button"
            name="submitAttestationChangeRequestButton"
            disabled={!attestation}
            variant="contained"
            onClick={createAttestationChangeRequest}
          >
            Submit Attestation Change Request
          </Button>
        </CardActions>
      </Card>
    </ThemeProvider>
  );
}

export default ChplAttestationChangeRequest;

ChplAttestationChangeRequest.propTypes = {
  dispatch: func.isRequired,
  developer: object.isRequired,
};
