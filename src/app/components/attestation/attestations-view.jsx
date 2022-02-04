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

import { useFetchPublicAttestations } from 'api/developer';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';
import theme from 'themes/theme';

function ChplAttestationsView(props) {
  const DateUtil = getAngularService('DateUtil');
  const { hasAnyRole, hasAuthorityOn } = useContext(UserContext);
  const { developer } = props;
  const { isLoading, data } = useFetchPublicAttestations({ developer });

  const createAttestationChangeRequest = () => {
    props.dispatch('createAttestation');
  };

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardHeader title="Attestations" />
        <CardContent>
          <Typography gutterBottom variant="body1">
            Attestations information is displayed here if a health IT developer’s attestation of compliance with the
            {' '}
            <a href="https://www.healthit.gov/topic/certification-ehrs/conditions-maintenance-certification">Conditions and Maintenance of Certification requirements</a>
            {' '}
            was submitted. For more information, please visit the
            {' '}
            <a href="">Attestations Fact Sheet</a>
            .
          </Typography>
          { (!isLoading && data?.length > 0)
            && (
              <>
                <Typography>
                  Attestation Period
                  { data.length !== 1 ? 's' : '' }
                  :
                </Typography>
                <ul>
                  { data.map((item) => (
                    <li key={item.id}>
                      { DateUtil.getDisplayDateFormat(item.attestationPeriod.periodStart) }
                      {' '}
                      to
                      {' '}
                      { DateUtil.getDisplayDateFormat(item.attestationPeriod.periodEnd) }
                      : Attestations submitted
                    </li>
                  ))}
                </ul>
              </>
            )}
        </CardContent>
        { hasAnyRole(['ROLE_DEVELOPER']) && hasAuthorityOn({ id: developer.developerId })
          && (
            <CardActions>
              <Button
                color="primary"
                id="create-attestation-change-request-button"
                name="createAttestationChangeRequestButton"
                variant="contained"
                onClick={createAttestationChangeRequest}
              >
                Submit Attestations
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
