import React, { useContext, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  ThemeProvider,
  Typography,
} from '@material-ui/core';
import { func } from 'prop-types';

import {
  useFetchAttestations,
} from 'api/developer';
import { UserContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';
import theme from 'themes/theme';

function ChplAttestationChangeRequestView(props) {
  /* eslint-disable react/destructuring-assignment */
  const { hasAnyRole } = useContext(UserContext);
  const [developer] = useState(props.developer);
  /* eslint-enable react/destructuring-assignment */

  const { isLoading, data } = useFetchAttestations({
    developer,
  });

  const createAttestationChangeRequest = () => {
    props.dispatch('createAttestation');
  };

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardHeader title="Attestations" />
        <CardContent>
          { (!isLoading && data)
            ? (
              <Typography variant="body1">
                {data}
              </Typography>
            ) : (
              <Typography variant="body1">
                No data exists
              </Typography>
            )}
        </CardContent>
        { hasAnyRole(['ROLE_DEVELOPER'])
          && (
            <CardActions>
              <Button
                color="primary"
                id="create-attestation-change-request-button"
                name="createAttestationChangeRequestButton"
                variant="contained"
                onClick={createAttestationChangeRequest}
              >
                Submit Attestation
              </Button>
            </CardActions>
          )}
      </Card>
    </ThemeProvider>
  );
}

export default ChplAttestationChangeRequestView;

ChplAttestationChangeRequestView.propTypes = {
  dispatch: func.isRequired,
  developer: developerPropType.isRequired,
};
