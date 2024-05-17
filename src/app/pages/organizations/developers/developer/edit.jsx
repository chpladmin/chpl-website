import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import AddIcon from '@material-ui/icons/Add';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { useFetchDevelopers, usePutJoinDevelopers } from 'api/developer';
import { ChplActionBar } from 'components/action-bar';
import ChplDeveloper from 'components/developer/developer';
import { ChplConfirmation, ChplTextField } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
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
  const $rootScope = getAngularService('$rootScope');
  const $state = getAngularService('$state');
  const toaster = getAngularService('toaster');
  const { data, isLoading } = useFetchDevelopers();
  const { mutate } = usePutJoinDevelopers();
  const [action, setAction] = useState(undefined);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const classes = useStyles();

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        $state.go('organizations.developers.developer', {
          id: developer.id,
          productId: undefined,
        }, { reload: true });
        break;
      case 'save':
        /*
          if (this.hasAnyRole(['chpl-developer'])) {
          this.saveRequest(developer);
          } else {
          this.errorMessages = [];
          const that = this;
          this.developer = developer;
          this.networkService.updateDeveloper(this.developer).then((response) => {
          let body;
          if (!response.status || response.status === 200 || angular.isObject(response.status)) {
          that.developer = response;
          that.backup.developer = angular.copy(response);
          that.$state.go('^', undefined, { reload: true });
          } else if (response.data.errorMessages) {
          body = response.data.errorMessages.join(', ');
          } else if (response.data.error) {
          body = response.data.error;
          } else {
          body = 'An unexpected error has occurred.';
          }
          if (body) {
          that.toaster.pop({
          type: 'error',
          title: 'Error',
          body,
          });
          }
          }, (error) => {
          let body;
          if (error.data.errorMessages) {
          that.errorMessages = error.data.errorMessages;
          } else if (error.data.error) {
          body = error.data.error;
          } else {
          body = 'An unexpected error has occurred.';
          }
          if (body) {
          that.toaster.pop({
          type: 'error',
          title: 'Error',
          body,
          });
          }
          });
          }
          }
        */
        setIsProcessing(true);
        mutate({
          developer: activeDeveloper,
          developerIds: developersToJoin.map((dev) => dev.id),
        }, {
          onSuccess: (response) => {
            setIsProcessing(false);
            const message = `Your request has been submitted and you'll get an email at ${response.data.job.jobDataMap.user.email} when it's done`;
            toaster.pop({
              type: 'success',
              title: 'Join Developer request submitted',
              body: message,
            });
            $state.go('^');
          },
          onError: (error) => {
            setIsProcessing(false);
            const message = error.response.data.error;
            toaster.pop({
              type: 'error',
              title: 'An error has occurred',
              body: message,
            });
            $rootScope.$digest();
          },
        });
        break;
        // no default
    }
  };

  const saveRequest = (data) => {
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
      this.toaster.pop({
      type,
      title,
      body,
      bodyOutputType: 'trustedHtml',
      });
    */
  };

  if (isLoading || !developer) { return <CircularProgress />; }

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
          { action === 'confirmation'
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
