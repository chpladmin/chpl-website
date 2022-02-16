import React, { useContext, useState } from 'react';
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
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useSnackbar } from 'notistack';

import { useFetchAttestations, useFetchPublicAttestations, usePostAttestationException } from 'api/developer';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';

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
  const { mutate } = usePostAttestationException();
  const { enqueueSnackbar } = useSnackbar();
  const { data: { canSubmitAttestationChangeRequest = false, canCreateException = false } } = useFetchAttestations({ developer });
  const [isCreatingException, setIsCreatingException] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const classes = useStyles();

  const cancelCreatingException = () => {
    setIsCreatingException(false);
  };

  const createAttestationChangeRequest = () => {
    props.dispatch('createAttestation');
  };

  const createAttestationException = () => {
    setIsSubmitting(true);
    const payload = {
      developer,
    };
    mutate(payload, {
      onSuccess: (response) => {
        setIsCreatingException(false);
        setIsSubmitting(false);
        const message = `You created an exception for ${response.developer?.name} valid until ${response.date}`;
        enqueueSnackbar(message, {
          variant: 'success',
        });
      },
      onError: () => {
        const message = 'Something went wrong. Please try again or contact ONC for support';
        enqueueSnackbar(message, {
          variant: 'error',
        });
        setIsSubmitting(false);
      },
    });
  };

  return (
    <Card>
      <CardHeader title="Attestations" />
      <CardContent className={classes.content}>
        { !isCreatingException
          && (
            <>
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
            </>
          )}
        { isCreatingException
          && (
            <>
              <Typography>
                You are re-opening Attestation submissions for
                {' '}
                { developer.name }
                .
              </Typography>
            </>
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
              disabled={!canSubmitAttestationChangeRequest}
            >
              Submit Attestations
            </Button>
          </CardActions>
        )}
      { hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])
        && (
          <CardActions>
            { !isCreatingException
              && (
              <Button
                color="primary"
                id="create-attestation-exception-button"
                variant="contained"
                onClick={() => setIsCreatingException(true)}
                disabled={!canCreateException}
              >
                Re-Open Submission
              </Button>
              )}
            { isCreatingException
              && (
                <>
                  <Button
                    color="primary"
                    id="create-attestation-exception-button"
                    variant="contained"
                    disabled={isSubmitting}
                    onClick={createAttestationException}
                  >
                    Create
                  </Button>
                  <Button
                    color="primary"
                    id="cancel-attestation-exception-button"
                    onClick={cancelCreatingException}
                  >
                    Cancel
                  </Button>
                </>
              )}
          </CardActions>
        )}
    </Card>
  );
}

export default ChplAttestationsView;

ChplAttestationsView.propTypes = {
  dispatch: func.isRequired,
  developer: developerPropType.isRequired,
};
