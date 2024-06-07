import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  CircularProgress,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { string } from 'prop-types';
import { useSnackbar } from 'notistack';

import { useFetchInvitationType } from 'api/users';
import {
  ChplUserAddPermissions,
  ChplUserCreate,
  ChplCognitoUserCreate,
} from 'components/registration';
import { getAngularService } from 'services/angular-react-helper';
import { FlagContext, UserContext } from 'shared/contexts';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
});

function ChplRegisterUser({ hash }) {
  const $analytics = getAngularService('$analytics');
  const $rootScope = getAngularService('$rootScope');
  const $state = getAngularService('$state');
  const Idle = getAngularService('Idle');
  const Keepalive = getAngularService('Keepalive');
  const authService = getAngularService('authService');
  const networkService = getAngularService('networkService');
  const toaster = getAngularService('toaster');
  const { enqueueSnackbar } = useSnackbar();
  const [invitationType, setInvitationType] = useState('');
  const [message, setMessage] = useState('');
  const [ssoIsOn, setSsoIsOn] = useState(false);
  const [state, setState] = useState('signin');
  const { data, isLoading, isSuccess } = useFetchInvitationType({ hash });
  const { setUser } = useContext(UserContext);
  const { isOn } = useContext(FlagContext);
  const classes = useStyles();
  let handleDispatch;

  useEffect(() => {
    setSsoIsOn(isOn('sso'));
  }, [isOn]);

  useEffect(() => {
    if (authService.hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'ROLE_CMS_STAFF', 'chpl-developer'])) {
      handleDispatch('authorize', {});
    }
  }, []);

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    setInvitationType(data);
    if (data === 'COGNITO' || data === 'COGNTIO') {
      setState('create');
    }
  }, [data, isLoading, isSuccess]);

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
            $analytics.eventTrack('Log In To Your Account', { category: 'Authentication' });
            toaster.pop({
              type: 'success',
              title: 'Success',
              body: 'Your new permissions have been added',
            });
            $state.go('administration');
            networkService.getUserById(authService.getUserId())
              .then((user) => {
                setUser(user);
                authService.saveCurrentUser(user);
                Idle.watch();
                Keepalive.ping();
                $rootScope.$broadcast('loggedIn');
              });
          }, (error) => {
            if (error.status === 401) {
              setMessage('A user may not have more than one role, or your username / password are incorrect');
            } else {
              setMessage(error.data.error);
            }
          });
        break;
      case 'cognito-create':
        packet = {
          hash,
          user: payload,
        };
        console.log({ packet });
        /*
        // TODO: change this logic
        networkService.createInvitedCognitoUser(packet)
          .then(() => {
            setMessage('Your account has been created. A one-time password has been emailed to you.')
            setState('success');
          }, (error) => {
            if (error.data.errorMessages) {
              setMessage('You have the following errors: ' + error.data.errorMessages.join('; '));
            } else if (error.data.error) {
              enqueueSnackbar(error.data.error, {
                variant: 'error',
              })
            }
          });
          */
        break;
      case 'create':
        packet = {
          hash,
          user: payload,
        };
        networkService.createInvitedUser(packet)
          .then(() => {
            $analytics.eventTrack('Create Account', { category: 'Authentication' });
            setMessage('Your account has been created. Please check your email to confirm your account');
            setState('success');
          }, (error) => {
            if (error.data.errorMessages) {
              setMessage(error.data.errorMessages);
            } else if (error.data.error) {
              setMessage(error.data.error);
            }
          });
        break;
        // no default
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
            { ssoIsOn && (invitationType === 'COGNITO' || invitationType === 'COGNTIO')
              && (
                <ChplCognitoUserCreate dispatch={handleDispatch} />
              )}
            { invitationType === 'CHPL'
              && (
                <>
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
              )}
            { invitationType === ''
              && (
                <CircularProgress />
              )}
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
