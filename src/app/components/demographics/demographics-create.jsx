import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { func } from 'prop-types';

import ChplDemographicsWizard from './demographics-wizard';

import { useFetchChangeRequestTypes, usePostChangeRequest } from 'api/change-requests';
import UrlCheckerWrapper from 'components/url-checker/url-checker-wrapper';
import { DeveloperContext } from 'shared/contexts';

const useStyles = makeStyles({
  pageHeader: {
    paddingTop: '32px',
    paddingBottom: '16px',
  },
});

function ChplDemographicsCreate({ dispatch }) {
  const { developer } = useContext(DeveloperContext);
  const { enqueueSnackbar } = useSnackbar();
  const [changeRequestType, setChangeRequestType] = useState({});
  const [errors, setErrors] = useState([]);
  const [stage, setStage] = useState(0);
  const crData = useFetchChangeRequestTypes();
  const { mutate, isLoading: isSubmitting } = usePostChangeRequest();
  const classes = useStyles();

  useEffect(() => {
    if (crData.isLoading) {
      return;
    }
    setChangeRequestType(crData.data.find((type) => type.name === 'Developer Demographics Change Request'));
  }, [crData.data, crData.isLoading]);

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'close':
        dispatch('cancel');
        break;
      case 'stage':
        setStage(payload);
        break;
      case 'submit':
        setErrors([]);
        mutate({
          developer,
          changeRequestType,
          details: {
            ...developer,
            ...payload,
            contact: {
              ...payload,
            },
            address: {
              ...payload,
            },
          },
        }, {
          onSuccess: () => {
            setStage(2);
          },
          onError: (error) => {
            if (error.response.data.error?.startsWith('Email could not be sent to')) {
              enqueueSnackbar(`${error.response.data.error} However, the changes have been applied`, {
                variant: 'info',
              });
              setStage(3);
            } else if (error.response.data?.errorMessages?.length > 0) {
              setErrors(error.response.data.errorMessages);
            } else {
              const message = error.response.data?.error;
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
      <Container maxWidth="md">
        <div className={classes.pageHeader}>
          <Typography gutterBottom component="h1" variant="h2">
            Submit Demographics Change
          </Typography>
        </div>
      </Container>
      <UrlCheckerWrapper>
        <ChplDemographicsWizard
          isSubmitting={isSubmitting}
          developer={developer}
          dispatch={handleDispatch}
          stage={stage}
          errors={errors}
        />
      </UrlCheckerWrapper>
    </>
  );
}

export default ChplDemographicsCreate;

ChplDemographicsCreate.propTypes = {
  dispatch: func.isRequired,
};
