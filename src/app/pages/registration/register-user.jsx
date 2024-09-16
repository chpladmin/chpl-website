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

import {
  usePostCreateCognitoInvitedUser,
  usePostCreateInvitedUser,
} from 'api/users';
import ChplCognitoLogin from 'components/login/cognito-login';
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
  const authService = getAngularService('authService');
  const networkService = getAngularService('networkService');
  const { enqueueSnackbar } = useSnackbar();
  const [invitationType, setInvitationType] = useState('');
  const [message, setMessage] = useState('');
  const [ssoIsOn, setSsoIsOn] = useState(false);
  const [state, setState] = useState('signin');
  const [cognitoLoginComponentState, setCognitoLoginComponentState] = useState('SIGNIN');
  const { mutate: createCognitoInvited } = usePostCreateCognitoInvitedUser();
  const { mutate: createInvited } = usePostCreateInvitedUser();
  const { setUser } = useContext(UserContext);
  const { isOn } = useContext(FlagContext);
  const classes = useStyles();
  let handleDispatch;

  useEffect(() => {
    setSsoIsOn(isOn('sso'));
  }, [isOn]);

  useEffect(() => {
    if (authService.hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-cms-staff', 'chpl-developer'])) {
      handleDispatch('authorize', {});
    }
  }, []);

  useEffect(() => {
    const type = hash.indexOf('-') > -1 ? 'COGNITO' : 'CHPL';
    setInvitationType(type);
    if (type === 'COGNITO') {
      setState('create');
    }
  }, [hash]);

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
            enqueueSnackbar('Success: Your new permissions have been added', {
              variant: 'success',
            });
            $state.go('administration');
            networkService.getUserById(authService.getUserId())
              .then((user) => {
                setUser(user);
                authService.saveCurrentUser(user);
                Idle.watch();
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
        createCognitoInvited(packet, {
          onSuccess: () => {
            $analytics.eventTrack('Create Account', { category: 'Authentication' });
            setMessage('Your account has been created. Please check your email for your temporary password');
            setState('cognito-login');
          },
          onError: (error) => {
            if (error.response.data.errorMessages?.length > 0) {
              setMessage(error.response.data.errorMessages[0]);
            } else {
              setMessage('An error occurred');
            }
          },
        });
        break;
      case 'create':
        packet = {
          hash,
          user: payload,
        };
        createInvited(packet, {
          onSuccess: () => {
            $analytics.eventTrack('Create Account', { category: 'Authentication' });
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
      case 'cognito-login':
        return (
          <>
            <Typography>{ message }</Typography>
            <ChplCognitoLogin 
              dispatch={handleDispatch} 
              state={cognitoLoginComponentState}
              setState={setCognitoLoginComponentState}
            />
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
            { ssoIsOn && invitationType === 'COGNITO'
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
