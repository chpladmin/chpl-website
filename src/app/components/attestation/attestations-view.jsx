import React, { useContext } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';

import { useFetchAttestations, useFetchPublicAttestations } from 'api/developer';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';
import theme from 'themes/theme';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '8px',
  },
});

function ChplAttestationsView(props) {
  const DateUtil = getAngularService('DateUtil');
  const { hasAnyRole, hasAuthorityOn } = useContext(UserContext);
  const { developer } = props;
  const { isLoading, data } = useFetchPublicAttestations({ developer });
  const attestationData = useFetchAttestations({ developer });
  const classes = useStyles();

  const createAttestationChangeRequest = () => {
    props.dispatch('createAttestation');
  };

  const createAttestationException = () => {
    console.log('do something to create an attesation exception');
  };

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardHeader title="Attestations" />
        <CardContent className={classes.content}>
          <Typography variant="body1">
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
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Attestation Period</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    { data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          { DateUtil.getDisplayDateFormat(item.attestationPeriod.periodStart) }
                          {' '}
                          to
                          {' '}
                          { DateUtil.getDisplayDateFormat(item.attestationPeriod.periodEnd) }
                        </TableCell>
                        <TableCell>
                          Attestations submitted
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
        </CardContent>
        { hasAnyRole(['ROLE_DEVELOPER']) && hasAuthorityOn({ id: developer.developerId })
          && (
            <CardActions>
              <Button
                color="primary"
                id="create-attestation-change-request-button"
                variant="contained"
                onClick={createAttestationChangeRequest}
                disabled={!attestationData.data?.canSubmitAttestationChangeRequest}
              >
                Submit Attestations
              </Button>
            </CardActions>
          )}
        { hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])
          && (
            <CardActions>
              <Button
                color="primary"
                id="create-attestation-exception-button"
                variant="contained"
                onClick={createAttestationException}
                disabled={attestationData.data?.canSubmitAttestationChangeRequest}
              >
                Create Attestations Submission Exception
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
