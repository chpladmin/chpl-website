import React, { useContext } from 'react';
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

import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';
import theme from 'themes/theme';

function ChplAttestationsView(props) {
  const DateUtil = getAngularService('DateUtil');
  const { hasAnyRole } = useContext(UserContext);
  const { developer } = props;

  const createAttestationChangeRequest = () => {
    props.dispatch('createAttestation');
  };

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardHeader title="Attestations" />
        <CardContent>
          <Typography variant="body1">
            This section includes Developer Attestations, which is a semi-annual Condition and Maintenance of Certification requirement for health IT developers participating in the ONC Health IT Certification Program. The term &quot;Attestations Submitted&quot; means a developer’s attestations have been submitted and confirmed for the given period.
          </Typography>
          <Typography variant="body1">
            If applicable, Attestations are required to be made publicly available on the CHPL each May and October, beginning in 2022. For more information, please visit the Attestation resources.
          </Typography>
          { (developer.attestationResponses?.length > 0)
            && (
              <ul>
                { developer.attestationResponses.map((item) => (
                  <li key={item.id}>
                    { DateUtil.getDisplayDateFormat(item.period.periodStart) }
                    {' '}
                    to
                    {' '}
                    { DateUtil.getDisplayDateFormat(item.period.periodEnd) }
                    : Attestations submitted
                  </li>
                ))}
              </ul>
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

export default ChplAttestationsView;

ChplAttestationsView.propTypes = {
  dispatch: func.isRequired,
  developer: developerPropType.isRequired,
};
