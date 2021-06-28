import React, { useEffect, useState } from 'react';
import {
  string,
} from 'prop-types';
import {
  Button,
  Container,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';

import theme from '../../themes/theme';
import {
  ChplUserAddPermissions,
  ChplUserCreate,
} from '../../components/registration';
import { getAngularService } from '../../services/angular-react-helper';

const useStyles = makeStyles(() => ({
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
}));

function ChplRegisterUser(props) {
  const [hash] = useState(props.hash); // eslint-disable-line react/destructuring-assignment
  const [message, setMessage] = useState('');
  const [state, setState] = useState('signin');
  const $analytics = getAngularService('$analytics');
  const $state = getAngularService('$state');
  const authService = getAngularService('authService');
  const networkService = getAngularService('networkService');
  const toaster = getAngularService('toaster');
  const classes = useStyles();

  let handleDispatch;

  useEffect(() => {
    if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
      handleDispatch('authorize', {});
    }
  }, []);

  handleDispatch = (action, data) => {
    setMessage('');
    let packet;
    let userId;
    switch (action) {
      case 'authorize':
        packet = {
          ...data,
          userName: data.email,
          hash,
        };
        userId = data.email || authService.getUserId();
        networkService.authorizeUser(packet, userId)
          .then(() => {
            $analytics.eventTrack('Log In To Your Account', { category: 'Authentication' });
            toaster.pop({
              type: 'success',
              title: 'Success',
              body: 'Your new permissions have been added',
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
          user: data,
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
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container className={classes.content}>
        <Typography variant="h1">
          User Registration
        </Typography>
        { getState() }
      </Container>
    </ThemeProvider>
  );
}

export default ChplRegisterUser;

ChplRegisterUser.propTypes = {
  hash: string.isRequired,
};
