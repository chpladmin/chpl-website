import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';
import { useSnackbar } from 'notistack';

import { usePostAuthorizeUser, usePostCreateCognitoInvitedUser } from 'api/users';
import ChplCognitoLogin from 'components/login/cognito-login';
import { ChplCognitoUserCreate } from 'components/registration';
import { eventTrack } from 'services/analytics.service';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext, useAnalyticsContext } from 'shared/contexts';
import { palette } from 'themes';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    padding: '16px',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
  body: {
    padding: '2vh',
  },
  cardFooter: {
    border: '.5px solid #afafaf',
    bgcolor: '#fff',
    mt: '-8px',
    display: 'flex',
    gridGap: '4px',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '8px',
  },
});

function ChplRegisterUser({ hash }) {
  const $state = getAngularService('$state');
  const authService = getAngularService('authService');
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole, setUser } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [message, setMessage] = useState('');
  const [state, setState] = useState('login');
  const [cognitoLoginComponentState, setCognitoLoginComponentState] = useState('SIGNIN');
  const { mutate: authorizeSsoUser } = usePostAuthorizeUser();
  const { mutate: createCognitoInvited } = usePostCreateCognitoInvitedUser();
  const classes = useStyles();
  let handleDispatch;

  useEffect(() => {
    if (hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-cms-staff', 'chpl-developer'])) {
      handleDispatch('authorize', {});
    }
  }, [hash]);

  handleDispatch = (action, payload) => {
    setMessage('');
    let packet;
    switch (action) {
      case 'authorize':
        authorizeSsoUser(hash, {
          onSuccess: (response) => {
            enqueueSnackbar('Success: Your new permissions have been added', {
              variant: 'success',
            });
            setUser(response.data);
            authService.saveCurrentUser(response.data);
            $state.go('administration');
          },
          onError: (error) => {
            if (error.status === 401) {
              enqueueSnackbar('A user may not have more than one role, or your username / password are incorrect', {
                variant: 'error',
              });
            } else {
              setMessage(error.response.data.error);
            }
          },
        });
        break;
      case 'create':
        packet = {
          hash,
          user: payload,
        };
        createCognitoInvited(packet, {
          onSuccess: () => {
            eventTrack({
              ...analytics,
              category: 'Authentication',
              event: 'Create New Account',
            });
            enqueueSnackbar('Your account has been created. Please check your email for your temporary password', {
              variant: 'success',
            });
            setState('login');
          },
          onError: (error) => {
            let errorMessage = ''; // Initialize the errorMessage variable

            if (error.response?.data?.errorMessages?.length > 0) {
              errorMessage = error.response.data.errorMessages[0];
            } else if (error.response?.data?.error) {
              errorMessage = error.response.data.error;
            } else {
              errorMessage = 'An error occurred';
            }
            enqueueSnackbar(errorMessage, {
              variant: 'error',
            });
          },
        });
        break;
      case 'forceChangePassword':
        setMessage('');
        break;
      case 'loggedIn':
        handleDispatch('authorize', {});
        setMessage('');
        break;
      default:
        console.error(`No action matches ${action} with payload ${payload}`);
    }
  };

  const getState = () => {
    switch (state) {
      case 'login':
        return (
          <>
            <ChplCognitoLogin
              dispatch={handleDispatch}
              state={cognitoLoginComponentState}
              setState={setCognitoLoginComponentState}
            />
            <Box className={classes.cardFooter}>
              <Typography variant="body2">
                Dont have an account?
              </Typography>
              <Button
                color="primary"
                variant="outlined"
                size="small"
                onClick={() => setState('create')}
              >
                create a new account
              </Button>
            </Box>
          </>
        );
      case 'create':
        return (
          <>
            <ChplCognitoUserCreate dispatch={handleDispatch} />
            <Box className={classes.cardFooter}>
              <Typography>
                Have an account?
              </Typography>
              <Button
                color="primary"
                variant="outlined"
                size="small"
                onClick={() => setState('cognito-login')}
              >
                log in to your existing account
              </Button>
            </Box>
          </>
        );
      case 'success':
        return (
          <Typography>{ message }</Typography>
        );
      default:
        console.error(`No state matches ${state}`);
        return null;
    }
  };

  return (
    <div>
      <Container maxWidth="xs" className={classes.content}>
        <Typography variant="h1">
          User Registration
        </Typography>
      </Container>
      <Box className={classes.body} bgcolor={palette.background}>
        <Container maxWidth="xs">
          { getState() }
        </Container>
      </Box>
    </div>
  );
}

export default ChplRegisterUser;

ChplRegisterUser.propTypes = {
  hash: string.isRequired,
};
