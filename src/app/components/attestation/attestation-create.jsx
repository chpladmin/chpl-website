import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import ChplAttestationWizard from './attestation-wizard';

import { useFetchAttestationForm } from 'api/attestations';
import { useFetchChangeRequestTypes, usePostChangeRequest } from 'api/change-requests';
import { useFetchAttestations } from 'api/developer';
import { getAngularService } from 'services/angular-react-helper';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';

const useStyles = makeStyles({
  pageHeader: {
    padding: '8px 0',
  },
});

function ChplAttestationCreate(props) {
  const $state = getAngularService('$state');
  const { hasAnyRole } = useContext(UserContext);
  const { developer } = props;
  const { enqueueSnackbar } = useSnackbar();
  const [changeRequestType, setChangeRequestType] = useState({});
  const [form, setForm] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [period, setPeriod] = useState({});
  const [stage, setStage] = useState(0);
  const { data, isLoading } = useFetchAttestationForm({ period });
  const { data: { submittablePeriod = {} } = {} } = useFetchAttestations({ developer, isAuthenticated: hasAnyRole(['ROLE_DEVELOPER']) });
  const crData = useFetchChangeRequestTypes();
  const { mutate } = usePostChangeRequest();
  const classes = useStyles();

  useEffect(() => {
    if (isLoading || !data?.form) {
      return;
    }
    setForm(data.form);
  }, [isLoading, data]);

  useEffect(() => {
    if (submittablePeriod) {
      setPeriod(submittablePeriod);
    }
  }, [submittablePeriod]);

  useEffect(() => {
    if (crData.isLoading) {
      return;
    }
    setChangeRequestType(crData.data.data.find((type) => type.name === 'Developer Attestation Change Request'));
  }, [crData.data, crData.isLoading]);

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
          ...payload,
          changeRequestType,
          developer,
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
          Submit Attestations
        </Typography>
        { period
          && (
            <Typography gutterBottom variant="body1">
              <strong>Attestation Period:</strong>
              {' '}
              { getDisplayDateFormat(period.periodStart) }
              {' '}
              -
              {' '}
              { getDisplayDateFormat(period.periodEnd) }
            </Typography>
          )}
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

export default ChplAttestationCreate;

ChplAttestationCreate.propTypes = {
  developer: developerPropType.isRequired,
};
