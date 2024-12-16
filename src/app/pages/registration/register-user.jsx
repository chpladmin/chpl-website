import React, { useContext, useEffect, useState } from 'react';
import {
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

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
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
              setMessage('A user may not have more than one role, or your username / password are incorrect');
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
            setMessage('Your account has been created. Please check your email for your temporary password');
            setState('login');
          },
          onError: (error) => {
            if (error.response.data.errorMessages?.length > 0) {
              setMessage(error.response.data.errorMessages[0]);
            } else if (error.response.data.error) {
              setMessage(error.response.data.error);
            } else {
              setMessage('An error occurred');
            }
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
            <Typography>{ message }</Typography>
            <ChplCognitoLogin
              dispatch={handleDispatch}
              state={cognitoLoginComponentState}
              setState={setCognitoLoginComponentState}
            />
            <Typography>
              Or
              {' '}
              <Button
                color="primary"
                variant="outlined"
                onClick={() => setState('create')}
              >
                create a new account
              </Button>
            </Typography>
          </>
        );
      case 'create':
        return (
          <>
            { message.length > 0
              && (
                <Typography
                  color="error"
                >
                  { message }
                </Typography>
              )}
            <ChplCognitoUserCreate dispatch={handleDispatch} />
            <Typography>
              Or
              {' '}
              <Button
                color="primary"
                variant="outlined"
                onClick={() => setState('cognito-login')}
              >
                log in to your existing account
              </Button>
            </Typography>
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
    <Container className={classes.content}>
      <Typography variant="h1">
        User Registration
      </Typography>
      { getState() }
    </Container>
  );
}

export default ChplRegisterUser;

ChplRegisterUser.propTypes = {
  hash: string.isRequired,
};
