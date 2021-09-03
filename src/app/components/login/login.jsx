import React, { useContext, useEffect, useState } from 'react';
import { func } from 'prop-types';
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CardContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { getAngularService } from '../../services/angular-react-helper';
import { UserContext } from '../../shared/contexts';
import { ChplTextField } from '../util';
import PasswordStrengthMeter from './password-strength-meter';

const zxcvbn = require('zxcvbn');

const useStyles = makeStyles(() => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridRowGap: '8px',
  },
}));

const changeSchema = yup.object({
  oldPassword: yup.string()
    .required('Old Password is required'),
  newPassword: yup.string()
    .required('Password is required')
    .test(
      'password-strength',
      'Password is not strong enough',
      (value, context) => context.parent.passwordStrength >= 3,
    ),
  verificationPassword: yup.string()
    .required('Verification Password is required')
    .test(
      'password-matches',
      'Verification Password does not match Password',
      (value, context) => value === context.parent.newPassword,
    ),
});

const resetSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Email format is invalid'),
});

const signinSchema = yup.object({
  password: yup.string()
    .required('Password is required'),
  userName: yup.string()
    .required('Email (or User Name) is required'),
});

function ChplLogin(props) {
  /* eslint-disable react/destructuring-assignment */
  const $analytics = getAngularService('$analytics');
  const $rootScope = getAngularService('$rootScope');
  const Idle = getAngularService('Idle');
  const Keepalive = getAngularService('Keepalive');
  const authService = getAngularService('authService');
  const networkService = getAngularService('networkService');
  const toaster = getAngularService('toaster');
  const {
    user, setUser, impersonating, setImpersonating,
  } = useContext(UserContext);
  const [state, setState] = useState('SIGNIN');
  const [passwordMessages, setPasswordMessages] = useState([]);
  const [strength, setStrength] = useState(0);
  const classes = useStyles();
  let changeFormik;
  let resetFormik;
  let signinFormik;
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    if (user?.fullName) {
      if (impersonating) {
        setState('IMPERSONATING');
      } else {
        setState('LOGGEDIN');
      }
    }
  }, [user, impersonating]);

  const cancel = (e) => {
    e.stopPropagation();
    switch (state) {
      case 'CHANGEPASSWORD':
        setState('LOGGEDIN');
        break;
      case 'FORGOTPASSWORD':
        setState('SIGNIN');
        break;
      default:
        setState('');
    }
  };

  const changePassword = () => {
    networkService.changePassword({ oldPassword: changeFormik.values.oldPassword, newPassword: changeFormik.values.newPassword })
      .then((response) => {
        if (response.passwordUpdated) {
          $analytics.eventTrack('Change Password', { category: 'Authentication' });
          setState('LOGGEDIN');
          changeFormik.resetForm();
          toaster.pop({
            type: 'success',
            body: 'Password successfully changed',
          });
        } else {
          let body = 'Your password was not changed. ';
          if (response.warning) {
            body += response.warning;
          }
          if (response.suggestions && response.suggestions.length > 0) {
            body += `Suggestion${response.suggestions.length > 1 ? 's' : ''}: ${response.suggestions.join(' ')}`;
          }
          if (!response.warning && (!response.suggestions || response.suggestions.length === 0)) {
            body += 'Please try again with a stronger password.';
          }
          toaster.pop({
            type: 'error',
            body,
          });
        }
      }, () => {
        toaster.pop({
          type: 'error',
          body: 'Error. Please check your credentials or contact the administrator',
        });
      });
  };

  const getTitle = () => {
    switch (state) {
      case 'CHANGEPASSWORD': return `Change password for ${user.fullName}`;
      case 'FORGOTPASSWORD': return 'Reset password';
      case 'IMPERSONATING': return `Impersonating ${user.fullName}`;
      case 'LOGGEDIN': return user.fullName;
      case 'SIGNIN': return 'Login required';
      default: return 'Unknown state';
    }
  };

  const login = () => {
    networkService.login({ userName: signinFormik.values.userName, password: signinFormik.values.password })
      .then(() => {
        networkService.getUserById(authService.getUserId())
          .then((data) => {
            setUser(data);
            signinFormik.resetForm();
            $analytics.eventTrack('Log In', { category: 'Authentication' });
            authService.saveCurrentUser(data);
            Idle.watch();
            Keepalive.ping();
            $rootScope.$broadcast('loggedIn');
            props.dispatch('loggedIn');
          });
      });
  };

  const logout = (e) => {
    e.stopPropagation();
    setUser({});
    setState('SIGNIN');
    authService.logout();
    $analytics.eventTrack('Log Out', { category: 'Authentication' });
    Idle.unwatch();
    $rootScope.$broadcast('loggedOut');
  };

  const sendReset = () => {
    networkService.emailResetPassword({ email: resetFormik.values.email })
      .then(() => {
        $analytics.eventTrack('Send Reset Email', { category: 'Authentication' });
        setState('SIGNIN');
        resetFormik.resetForm();
        toaster.pop({
          type: 'success',
          body: 'Password email sent; please check your email',
        });
      }, () => {
        const body = `Email could not be sent to ${resetFormik.values.email}`;
        toaster.pop({
          type: 'error',
          body,
        });
      });
  };

  const stopImpersonating = (e) => {
    e.stopPropagation();
    networkService.unimpersonateUser()
      .then((token) => {
        setImpersonating(false);
        authService.saveToken(token.token);
        networkService.getUserById(authService.getUserId())
          .then((data) => {
            setUser(data);
            setState('LOGGEDIN');
            authService.saveCurrentUser(data);
            $rootScope.$broadcast('unimpersonating');
          });
      });
  };

  const submitChange = (e) => {
    e.stopPropagation();
    changeFormik.handleSubmit();
  };

  const submitReset = (e) => {
    e.stopPropagation();
    resetFormik.handleSubmit();
  };

  const submitSignin = (e) => {
    e.stopPropagation();
    signinFormik.handleSubmit();
  };

  const updatePassword = (event) => {
    const vals = ['chpl'];
    if (user?.fullName) { vals.push(user.fullName); }
    if (user?.friendlyName) { vals.push(user.friendlyName); }
    if (user?.email) { vals.push(user.email); }
    if (user?.phoneNumber) { vals.push(user.phoneNumber); }
    const passwordStrength = zxcvbn(event.target.value, vals);
    changeFormik.values.passwordStrength = passwordStrength.score;
    setStrength(passwordStrength.score);
    setPasswordMessages(
      [passwordStrength.feedback?.warning]
        .concat(passwordStrength.feedback?.suggestions)
        .filter((msg) => msg),
    );
    changeFormik.handleChange(event);
  };

  changeFormik = useFormik({
    validationSchema: changeSchema,
    initialValues: {
      oldPassword: '',
      newPassword: '',
      verificationPassword: '',
      passwordStrength: 0,
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: () => {
      changePassword();
    },
  });

  resetFormik = useFormik({
    validationSchema: resetSchema,
    initialValues: {
      email: '',
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: () => {
      sendReset();
    },
  });

  signinFormik = useFormik({
    validationSchema: signinSchema,
    initialValues: {
      password: '',
      userName: '',
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: () => {
      login();
    },
  });

  return (
    <Card>
      <CardHeader title={getTitle()} />
      <CardContent className={classes.grid}>
        { state === 'CHANGEPASSWORD'
          && (
          <>
            <ChplTextField
              type="password"
              id="old-password"
              name="oldPassword"
              label="Old Password"
              required
              value={changeFormik.values.oldPassword}
              onChange={changeFormik.handleChange}
              onBlur={changeFormik.handleBlur}
              error={changeFormik.touched.oldPassword && !!changeFormik.errors.oldPassword}
              helperText={changeFormik.touched.oldPassword && changeFormik.errors.oldPassword}
            />
            <ChplTextField
              type="password"
              id="new-password"
              name="newPassword"
              label="New Password"
              required
              value={changeFormik.values.newPassword}
              onChange={updatePassword}
              onBlur={changeFormik.handleBlur}
              error={changeFormik.touched.newPassword && !!changeFormik.errors.newPassword}
              helperText={changeFormik.touched.newPassword && changeFormik.errors.newPassword}
            />
            <PasswordStrengthMeter
              value={strength}
            />
            { passwordMessages.length > 0
              && (
                <ul>
                  { passwordMessages.map((msg) => (
                    <li key={msg}>{ msg }</li>
                  ))}
                </ul>
              )}
            <ChplTextField
              type="password"
              id="password-verification"
              name="verificationPassword"
              label="Verification Password"
              required
              value={changeFormik.values.verificationPassword}
              onChange={changeFormik.handleChange}
              onBlur={changeFormik.handleBlur}
              error={changeFormik.touched.verificationPassword && !!changeFormik.errors.verificationPassword}
              helperText={changeFormik.touched.verificationPassword && changeFormik.errors.verificationPassword}
            />
          </>
          )}
        { state === 'FORGOTPASSWORD'
          && (
          <ChplTextField
            id="email"
            name="email"
            label="Email"
            required
            value={resetFormik.values.email}
            onChange={resetFormik.handleChange}
            onBlur={resetFormik.handleBlur}
            error={resetFormik.touched.email && !!resetFormik.errors.email}
            helperText={resetFormik.touched.email && resetFormik.errors.email}
          />
          )}
        { state === 'SIGNIN'
          && (
          <>
            <ChplTextField
              id="user-name"
              name="userName"
              label="Email (or User Name)"
              required
              value={signinFormik.values.userName}
              onChange={signinFormik.handleChange}
              onBlur={signinFormik.handleBlur}
              error={signinFormik.touched.userName && !!signinFormik.errors.userName}
              helperText={signinFormik.touched.userName && signinFormik.errors.userName}
            />
            <ChplTextField
              type="password"
              id="password"
              name="password"
              label="Password"
              required
              value={signinFormik.values.password}
              onChange={signinFormik.handleChange}
              onBlur={signinFormik.handleBlur}
              error={signinFormik.touched.password && !!signinFormik.errors.password}
              helperText={signinFormik.touched.password && signinFormik.errors.password}
            />
            <Typography variant="body2">
              This warning banner provides privacy and security notices consistent with applicable federal laws, directives, and other federal guidance for accessing this Government system, which includes all devices/storage media attached to this system. This system is provided for Government-authorized use only. Unauthorized or improper use of this system is prohibited and may result in disciplinary action and/or civil and criminal penalties. At any time, and for any lawful Government purpose, the government may monitor, record, and audit your system usage and/or intercept, search and seize any communication or data transiting or stored on this system. Therefore, you have no reasonable expectation of privacy. Any communication or data transiting or stored on this system may be disclosed or used for any lawful Government purpose.
            </Typography>
          </>
          )}
      </CardContent>
      <CardActions>
        { state === 'IMPERSONATING'
          && (
          <Button
            color="primary"
            variant="outlined"
            onClick={stopImpersonating}
          >
            Stop Impersonating
          </Button>
          )}
        { (state === 'LOGGEDIN' || state === 'IMPERSONATING')
          && (
          <Button
            color="primary"
            variant="outlined"
            onClick={logout}
          >
            Log Out
          </Button>
          )}
        { state === 'LOGGEDIN'
          && (
          <Button
            color="primary"
            variant="outlined"
            onClick={(e) => { setState('CHANGEPASSWORD'); e.stopPropagation(); }}
          >
            Change Password
          </Button>
          )}
        { state === 'SIGNIN'
          && (
          <Button
            color="primary"
            variant="contained"
            onClick={submitSignin}
          >
            Log In
          </Button>
          )}
        { state === 'SIGNIN'
          && (
          <Button
            color="primary"
            variant="outlined"
            onClick={(e) => { setState('FORGOTPASSWORD'); e.stopPropagation(); }}
          >
            Forgot Password
          </Button>
          )}
        { state === 'FORGOTPASSWORD'
          && (
          <Button
            color="primary"
            variant="contained"
            onClick={submitReset}
          >
            Send reset email
          </Button>
          )}
        { state === 'CHANGEPASSWORD'
          && (
          <Button
            color="primary"
            variant="contained"
            onClick={submitChange}
          >
            Confirm new Password
          </Button>
          )}
        { (state === 'FORGOTPASSWORD' || state === 'CHANGEPASSWORD')
          && (
          <Button
            color="primary"
            variant="outlined"
            onClick={cancel}
          >
            Cancel
          </Button>
          )}
      </CardActions>
    </Card>
  );
}

export default ChplLogin;

ChplLogin.propTypes = {
  dispatch: func,
};

ChplLogin.defaultProps = {
  dispatch: () => {},
};
