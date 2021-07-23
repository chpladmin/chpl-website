import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
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
            id="create-attestation-change-request-button"
            name="createAttestationChangeRequestButton"
            variant="contained"
            onClick={createAttestationChangeRequest}
          >
            Create Attestation Change Request
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
