import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';
import { useSnackbar } from 'notistack';

import { usePostCreateInvitedUser } from 'api/users';
import { ChplUserAddPermissions, ChplUserCreate } from 'components/registration';
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
  const $rootScope = getAngularService('$rootScope');
  const $state = getAngularService('$state');
  const Idle = getAngularService('Idle');
  const authService = getAngularService('authService');
  const networkService = getAngularService('networkService');
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole, setUser } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const [message, setMessage] = useState('');
  const [state, setState] = useState('signin');
  const { mutate: createInvited } = usePostCreateInvitedUser();
  const classes = useStyles();
  let handleDispatch;

  useEffect(() => {
    if (hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-cms-staff', 'chpl-developer'])) {
      handleDispatch('authorize', {});
    }
  }, [hasAnyRole]);

  handleDispatch = (action, payload) => {
    setMessage('');
    let packet;
    let userId;
    switch (action) {
      case 'authorize':
        packet = {
          ...payload,
          userName: payload.email,
          hash,
        };
        userId = payload.email || authService.getUserId();
        networkService.authorizeUser(packet, userId)
          .then(() => {
            eventTrack({
              ...analytics,
              category: 'Authentication',
              event: 'Log In To Your Account',
            });
            enqueueSnackbar('Success: Your new permissions have been added', {
              variant: 'success',
            });
            networkService.getUserById(authService.getUserId())
              .then((user) => {
                setUser(user);
                authService.saveCurrentUser(user);
                Idle.watch();
                $rootScope.$broadcast('loggedIn');
              });
            $state.go('administration');
          }, (error) => {
            if (error.status === 401) {
              setMessage('A user may not have more than one role, or your username / password are incorrect');
            } else {
              setMessage(error.data.error);
            }
          });
        break;
      case 'create':
        packet = {
          hash,
          user: payload,
        };
        createInvited(packet, {
          onSuccess: () => {
            eventTrack({
              ...analytics,
              category: 'Authentication',
              event: 'Create New Account',
            });
            setMessage('Your account has been created. Please check your email to confirm your account');
            setState('success');
          },
          onError: (error) => {
            if (error.data.errorMessages) {
              setMessage(error.data.errorMessages);
            } else if (error.data.error) {
              setMessage(error.data.error);
            }
          },
        });
        break;
      case 'forceChangePassword':
        setMessage('');
        break;
      case 'loggedIn':
        setMessage('');
        break;
      default:
        console.error(`No action matches ${action} with payload ${payload}`);
    }
  };

  const getState = () => {
    switch (state) {
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
            <ChplUserCreate dispatch={handleDispatch} />
            <Typography>
              Or
              {' '}
              <Button
                color="primary"
                variant="outlined"
                onClick={() => setState('signin')}
              >
                log in to your existing account
              </Button>
            </Typography>
          </>
        );
      case 'signin':
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
            <ChplUserAddPermissions dispatch={handleDispatch} />
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
