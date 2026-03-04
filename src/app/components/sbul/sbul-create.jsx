import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { func } from 'prop-types';

import ChplSbulWizard from './sbul-wizard';

import { useFetchChangeRequestTypes, usePostChangeRequest } from 'api/change-requests';
import { useFetchSbulListings } from 'api/developer';
import { getDisplayDateFormat } from 'services/date-util';
import { DeveloperContext, UserContext } from 'shared/contexts';

const useStyles = makeStyles({
  pageHeader: {
    padding: '8px 0',
  },
});

function ChplSbulCreate({ dispatch }) {
  const { developer } = useContext(DeveloperContext);
  const { hasAnyRole } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [changeRequestType, setChangeRequestType] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [listings, setListings] = useState([]);
  const [stage, setStage] = useState(0);
  const { data, isLoading, isError } = useFetchSbulListings({ developer });
  const crData = useFetchChangeRequestTypes();
  const { mutate } = usePostChangeRequest();
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
    setChangeRequestType(crData.data.find((type) => type.name === 'Service Base URL List Change Request'));
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
          Submit Service Base URL List
        </Typography>
      </Container>
      <ChplSbulWizard
        isSubmitting={isSubmitting}
        developer={developer}
        dispatch={handleDispatch}
        listings={listings}
        stage={stage}
      />
    </>
  );
}

export default ChplSbulCreate;

ChplSbulCreate.propTypes = {
  dispatch: func.isRequired,
};
