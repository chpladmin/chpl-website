import React, { useContext, useState } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useSnackbar } from 'notistack';

import { usePostChangeRequest } from 'api/change-requests';
import { usePutDeveloper } from 'api/developer';
import ChplDeveloper from 'components/developer/developer';
import { ChplConfirmation } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { DeveloperContext, UserContext, useAnalyticsContext } from 'shared/contexts';
import { palette, theme } from 'themes';

const useStyles = makeStyles({
  pageContainer: {
    padding: '32px 32px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gridGap: '16px',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  cardContainer: {
    width: '100%',
    height: '700px',
    overflowY: 'scroll',
    [theme.breakpoints.up('md')]: {
      width: '50vw',
      height: 'auto',
      overflowY: 'hidden',
    },
  },
  stickyCardContainer: {
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50vw',
      position: 'sticky',
      top: '100px',
    },
  },
  errorColor: {
    border: '1px solid #c44f65',
    color: palette.error,
  },
});

function ChplEditDeveloper({ dispatch }) {
  const { analytics } = useAnalyticsContext();
  const { developer } = useContext(DeveloperContext);
  const { hasAnyRole } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: putDeveloper } = usePutDeveloper();
  const { mutate: postChangeRequest } = usePostChangeRequest();
  const [confirmationText, setConfirmationText] = useState('');
  const [errorMessages, setErrorMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const classes = useStyles();

  const handleError = (error) => {
    setIsProcessing(false);
    let messages;
    let type = 'error';
    // todo: check on API to figure out how to trigger this
    if (error.response?.data?.error === 'No data was changed.') {
      messages = ['Cannot "Submit" a change request when no changes have been made.'];
      type = 'info';
    } else {
      messages = error.response?.data?.errorMessages ? error.response.data.errorMessages : [];
    }
    const body = messages.length > 0 ? `Message${messages.length > 1 ? 's' : ''}:<ul>${messages.map((e) => `<li>${e}</li>`).join('')}</ul>`
      : 'An unexpected error occurred. Please try again or contact ONC for support';
    // todo: figure out how to make this a <List>
    enqueueSnackbar(<div dangerouslySetInnerHTML={{ __html: body }} />, {
      variant: type,
    });
  };

  const saveRequest = (data) => {
    postChangeRequest({
      developer,
      details: data,
      changeRequestType: {
        id: 2,
        name: 'Developer Demographics Change Request',
      },
    }, {
      onSuccess: () => {
        setIsProcessing(false);
        setConfirmationText('The submission has been completed successfully. It will be reviewed by an ONC-ACB or ONC. Once the submission has been approved, it will be displayed on the CHPL.');
      },
      onError: (error) => handleError(error),
    });
  };

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'cancel':
        dispatch('cancel');
        break;
      case 'save':
        setIsProcessing(true);
        eventTrack({
          ...analytics,
          event: 'Save Demographics',
        });
        if (hasAnyRole(['chpl-developer'])) {
          saveRequest(payload);
        } else {
          setErrorMessages([]);
          putDeveloper(payload, {
            onSuccess: (response) => {
              setIsProcessing(false);
              let body;
              if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                dispatch('cancel');
              } else if (response.data.errorMessages) {
                body = response.data.errorMessages.join(', ');
              } else if (response.data.error) {
                body = response.data.error;
              } else {
                body = 'An unexpected error has occurred.';
              }
              if (body) {
                enqueueSnackbar(body, {
                  variant: 'error',
                });
              }
            },
            onError: (error) => {
              setIsProcessing(false);
              let body;
              if (error.data?.errorMessages) {
                setErrorMessages(error.data.errorMessages);
              } else if (error.response?.data?.errorMessages) {
                setErrorMessages(error.response.data.errorMessages);
              } else if (error.data?.error) {
                body = error.data.error;
              } else {
                body = 'An unexpected error has occurred.';
              }
              if (body) {
                enqueueSnackbar(body, {
                  variant: 'error',
                });
              }
            },
          });
        }
        break;
        // no default
    }
  };

  if (!developer) { return <CircularProgress />; }

  return (
    <>
      <Container disableGutters maxWidth="xl">
        <Box className={classes.pageContainer}>
          <ChplDeveloper
            dispatch={handleDispatch}
            isEditing
            isProcessing={isProcessing}
            errorMessages={errorMessages}
          />
          { confirmationText.length > 0
            && (
              <ChplConfirmation
                dispatch={() => handleDispatch('cancel')}
                text={confirmationText}
              />
            )}
        </Box>
      </Container>
    </>
  );
}

export default ChplEditDeveloper;

ChplEditDeveloper.propTypes = {
  dispatch: func.isRequired,
};
