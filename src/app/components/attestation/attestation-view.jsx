import React, { useEffect, useState } from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { bool, object } from 'prop-types';
import { useSnackbar } from 'notistack';

import { usePostAttestationException } from 'api/developer';
import interpretLink from 'components/attestation/attestation-util';
import { getAngularService } from 'services/angular-react-helper';
import { developer as developerPropType } from 'shared/prop-types';

function ChplAttestationView(props) {
  const DateUtil = getAngularService('DateUtil');
  const { mutate } = usePostAttestationException();
  const { enqueueSnackbar } = useSnackbar();
  const [attestations, setAttestations] = useState({});
  const [canCreateException, setCanCreateException] = useState(false);
  const [developer, setDeveloper] = useState({});
  const [isCreatingException, setIsCreatingException] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setAttestations({
      ...props.attestations,
      period: props.attestations.period || props.attestations.attestationPeriod,
      responses: props.attestations.responses || props.attestations.attestationResponses,
    });
  }, [props.attestations]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setCanCreateException(props.canCreateException);
  }, [props.canCreateException]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setDeveloper(props.developer);
  }, [props.developer]); // eslint-disable-line react/destructuring-assignment

  const cancelCreatingException = () => {
    setIsCreatingException(false);
  };

  const createAttestationException = () => {
    setIsSubmitting(true);
    const payload = {
      developer,
      period: attestations.period,
    };
    mutate(payload, {
      onSuccess: ({ data: { exceptionEnd, developer: { name } } }) => {
        setIsCreatingException(false);
        setIsSubmitting(false);
        const message = `You have re-opened the submission feature for ${name} until ${DateUtil.getDisplayDateFormat(exceptionEnd)}.`;
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
    <>
      <Typography gutterBottom variant="subtitle2">Attestation Period</Typography>
      <Typography gutterBottom>
        { attestations.period && DateUtil.getDisplayDateFormat(attestations.period.periodStart) }
        {' '}
        -
        {' '}
        { attestations.period && DateUtil.getDisplayDateFormat(attestations.period.periodEnd) }
      </Typography>
      { !isCreatingException
        && (
          <>
            <Button
              color="primary"
              id="create-attestation-exception-button"
              variant="contained"
              onClick={() => setIsCreatingException(true)}
              disabled={!canCreateException}
            >
              Re-Open Submission
            </Button>
            <Typography gutterBottom variant="subtitle2">Submitted attestations</Typography>
            <Typography gutterBottom>{attestations.statusText}</Typography>
            { attestations.responses
              && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Attestation</TableCell>
                        <TableCell>Response</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      { attestations.responses
                        .sort((a, b) => a.attestation.sortOrder - b.attestation.sortOrder)
                        .map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <strong>
                                { item.attestation.condition.name }
                                {': '}
                              </strong>
                              { interpretLink(item.attestation.description) }
                            </TableCell>
                            <TableCell>
                              { item.response.response }
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
              This action will re-open the Attestations submission feature for
              {' '}
              { developer.name }
              . Please confirm you want to continue.
            </Typography>
            <Button
              color="primary"
              id="create-attestation-exception-button"
              variant="contained"
              disabled={isSubmitting}
              onClick={createAttestationException}
            >
              Confirm
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
    </>
  );
}

export default ChplAttestationView;

ChplAttestationView.propTypes = {
  attestations: object.isRequired, // eslint-disable-line react/forbid-prop-types
  canCreateException: bool,
  developer: developerPropType,
};

ChplAttestationView.defaultProps = {
  canCreateException: false,
  developer: {},
};
