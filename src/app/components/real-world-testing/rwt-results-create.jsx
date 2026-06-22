import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { func } from 'prop-types';

import ChplRwtResultsWizard from './rwt-results-wizard';

import { useFetchChangeRequestTypes, usePostChangeRequest } from 'api/change-requests';
import { useFetchRwtResultListings } from 'api/developer';
import UrlCheckerWrapper from 'components/url-checker/url-checker-wrapper';
import { DeveloperContext } from 'shared/contexts';

const useStyles = makeStyles({
  pageHeader: {
    paddingTop: '32px',
    paddingBottom: '16px',
  },
});

function ChplRwtResultsCreate({ dispatch }) {
  const { developer } = useContext(DeveloperContext);
  const { enqueueSnackbar } = useSnackbar();
  const [changeRequestType, setChangeRequestType] = useState({});
  const [errors, setErrors] = useState([]);
  const [listings, setListings] = useState([]);
  const [stage, setStage] = useState(0);
  const { data, isLoading, isError } = useFetchRwtResultListings({ developer });
  const crData = useFetchChangeRequestTypes();
  const { mutate, isLoading: isSubmitting } = usePostChangeRequest();
  const classes = useStyles();

  useEffect(() => {
    if (isLoading || isError) {
      return;
    }
    setListings(data.results);
  }, [data, isLoading, isError]);

  useEffect(() => {
    if (crData.isLoading) {
      return;
    }
    setChangeRequestType(crData.data.find((type) => type.name === 'RWT Results URL Change Request'));
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
        mutate(payload.details.selectedListings.map((listing) => ({
          developer,
          changeRequestType,
          details: {
            listing: { id: listing.id },
            url: payload.details.url,
          },
        })), {
          onSuccess: () => {
            setStage(3);
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
            Submit Real World Testing Results URL
          </Typography>
        </div>
      </Container>
      <UrlCheckerWrapper>
        <ChplRwtResultsWizard
          isSubmitting={isSubmitting}
          developer={developer}
          dispatch={handleDispatch}
          listings={listings}
          stage={stage}
          errors={errors}
        />
      </UrlCheckerWrapper>
    </>
  );
}

export default ChplRwtResultsCreate;

ChplRwtResultsCreate.propTypes = {
  dispatch: func.isRequired,
};
