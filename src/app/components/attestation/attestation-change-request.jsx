import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Typography,
} from '@material-ui/core';
import { func } from 'prop-types';

import theme from '../../themes/theme';

function ChplAttestationChangeRequest(props) {
  const createAttestationChangeRequest = () => {
    const request = { attestation: Date.now().toString() };
    props.onSaveRequest(request);
  };

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardHeader title="Attestations" />
        <CardContent>
          <Typography variant="body1">
            Display some attestation data here.
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            id="submit-attestation-change-request-button"
            name="submitAttestationChangeRequestButton"
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
  onSaveRequest: func.isRequired,
};
