import React, { useContext, useState } from 'react';
import {
  Box,
  CircularProgress,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';

import { usePutDeveloper } from 'api/developer';
import ChplDeveloper from 'components/developer/developer';
import { ChplConfirmation } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';
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

function ChplEditDeveloper({ developer }) {
  const $state = getAngularService('$state');
  const { hasAnyRole } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePutDeveloper();
  const [errorMessages, setErrorMessages] = useState([]);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const classes = useStyles();

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'cancel':
        $state.go('organizations.developers.developer', {
          id: developer.id,
          productId: undefined,
        }, { reload: true });
        break;
      case 'save':
        if (hasAnyRole(['chpl-developer'])) {
          saveRequest(payload);
        } else {
          setErrorMessages([]);
          mutate(payload, {
            onSuccess: (response) => {
              setIsProcessing(false);
              let body;
              if (!response.status || response.status === 200 || angular.isObject(response.status)) {
                $state.go('^', undefined, { reload: true });
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
              if (error.data.errorMessages) {
                setErrorMessages(error.data.errorMessages);
              } else if (error.data.error) {
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

  const saveRequest = (data) => {
    console.info('saving CR for developer edit');
    /*
      const that = this;
      const request = {
      developer: this.developer,
      details: data,
      changeRequestType: {
      id: 2,
      name: 'Developer Demographics Change Request',
      },
      };
      this.networkService.submitChangeRequest(request)
      .then(that.handleResponse.bind(that), that.handleError.bind(that));
    */
  };

  const handleResponse = () => {
    console.info('handling CR response for developer edit');
    /*
      let confirmationText = 'The submission has been completed successfully. It will be reviewed by an ONC-ACB or ONC. Once the submission has been approved, it will be displayed on the CHPL.';
      if (this.isWithdrawing) {
      confirmationText = 'Your change request has been successfully withdrawn.';
      }
      this.networkService.getChangeRequests().then((response) => { this.changeRequests = response; });
      this.action = 'confirmation';
      this.confirmationText = confirmationText;
      this.isWithdrawing = false;
    */
  };

  const handleError = (error) => {
    console.info('handling CR error for developer edit');
    /*
      let messages;
      let type = 'error';
      let title = 'Error in submission';
      if (error && error.data && error.data.error
      && error.data.error === 'No data was changed.') {
      messages = ['Cannot "Submit" a change request when no changes have been made.'];
      type = 'info';
      title = 'Please check your input';
      } else {
      messages = error.data.errorMessages ? error.data.errorMessages : [];
      }
      const body = messages.length > 0 ? `Message${messages.length > 1 ? 's' : ''}:<ul>${messages.map((e) => `<li>${e}</li>`).join('')}</ul>`
      : 'An unexpected error occurred. Please try again or contact ONC for support';
            enqueueSnackbar(body, {
              variant: type,
              // bodyOutputType: 'trustedHtml', maybe?
            });
    */
  };

  /* is this needed?
    closeConfirmation() {
      this.action = undefined;
      this.$state.go('^', undefined, { reload: true });
    }
    */

  if (!developer) { return <CircularProgress />; }

  return (
    <>
      <Box p={8} bgcolor={palette.white}>
        <Typography variant="h1">
          Developer Information
        </Typography>
      </Box>
      <Container disableGutters maxWidth="xl">
        <Box className={classes.pageContainer}>
          <ChplDeveloper
            developer={developer}
            dispatch={handleDispatch}
            isEditing
            errorMessages={errorMessages}
          />
          { isConfirming
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
  developer: developerPropType.isRequired,
};
