import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import {
  object,
} from 'prop-types';

import ChplAttestationWizard from './attestation-wizard';

import { usePutChangeRequest } from 'api/change-requests';
import { getAngularService } from 'services/angular-react-helper';
import { getDisplayDateFormat } from 'services/date-util';

const useStyles = makeStyles({
  pageHeader: {
    padding: '8px 0',
  },
});

function ChplAttestationEdit(props) {
  const $state = getAngularService('$state');
  const { changeRequest } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePutChangeRequest();
  const [form, setForm] = useState({});
  const [developer, setDeveloper] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [period, setPeriod] = useState({});
  const [stage, setStage] = useState(0);
  const classes = useStyles();

  useEffect(() => {
    if (!changeRequest?.details?.form) {
      setForm({});
      return;
    }
    setForm(changeRequest.details.form);
    setDeveloper(changeRequest.developer);
    setPeriod(changeRequest.details.attestationPeriod);
  }, [changeRequest]);

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'close':
        $state.go('organizations.developers.developer', { id: developer.id });
        break;
      case 'stage':
        setStage(payload);
        break;
      case 'submit':
        setIsSubmitting(true);
        mutate({
          ...changeRequest,
          ...payload,
          currentStatus: {
            changeRequestStatusType: { id: 1 },
            comment: '',
          },
        }, {
          onSuccess: () => {
            setIsSubmitting(false);
            setStage(3);
          },
          onError: (error) => {
            setIsSubmitting(false);
            if (error.response.data.error?.startsWith('Email could not be sent to')) {
              enqueueSnackbar(`${error.response.data.error} However, the changes have been applied`, {
                variant: 'info',
              });
              setStage(3);
            } else {
              const message = error.response.data?.error
                    || error.response.data?.errorMessages.join(' ');
              enqueueSnackbar(message, {
                variant: 'error',
              });
            }
          },
        });
        break;
        // no default
    }
  };

  return (
    <>
      <Container className={classes.pageHeader} maxWidth="md">
        <Typography gutterBottom variant="h1">
          Edit Attestations
        </Typography>
        <Typography gutterBottom variant="body1">
          <strong>Attestation Period:</strong>
          {' '}
          { getDisplayDateFormat(period.periodStart) }
          {' '}
          -
          {' '}
          { getDisplayDateFormat(period.periodEnd) }
        </Typography>
      </Container>
      <ChplAttestationWizard
        form={form}
        isSubmitting={isSubmitting}
        developer={developer}
        dispatch={handleDispatch}
        period={period}
        stage={stage}
      />
    </>
  );
}

export default ChplAttestationEdit;

ChplAttestationEdit.propTypes = {
  changeRequest: object.isRequired, // eslint-disable-line react/forbid-prop-types
};
