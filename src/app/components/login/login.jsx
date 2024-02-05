import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ClearIcon from '@material-ui/icons/Clear';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CreateIcon from '@material-ui/icons/Create';
import SendIcon from '@material-ui/icons/Send';
import NotInterestedIcon from '@material-ui/icons/NotInterested';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import PasswordStrengthMeter from './password-strength-meter';

import {
  usePostChangePassword,
  usePostEmailResetPassword,
  usePostLogin,
  usePostResetPassword,
} from 'api/auth';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import { ChplTextField } from 'components/util';
import { FlagContext } from 'shared/contexts';

const zxcvbn = require('zxcvbn');

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridRowGap: '16px',
  },
  loginHeader: {
    backgroundColor: '#ffffff',
    padding: '16px 0px 0px 16px',
  },
});

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
    .required('Verify Password is required')
    .test(
      'password-matches',
      'Verify Password does not match Password',
      (value, context) => value === context.parent.newPassword,
    ),
});

const resetSchema = yup.object({
  newPassword: yup.string()
    .required('Password is required')
    .test(
      'password-strength',
      'Password is not strong enough',
      (value, context) => context.parent.passwordStrength >= 3,
    ),
  verificationPassword: yup.string()
    .required('Verify Password is required')
    .test(
      'password-matches',
      'Verify Password does not match Password',
      (value, context) => value === context.parent.newPassword,
    ),
});

const sendResetSchema = yup.object({
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

function ChplLogin({ dispatch }) {
  const $analytics = getAngularService('$analytics');
  const $rootScope = getAngularService('$rootScope');
  const $stateParams = getAngularService('$stateParams');
  const Idle = getAngularService('Idle');
  const Keepalive = getAngularService('Keepalive');
  const authService = getAngularService('authService');
  const networkService = getAngularService('networkService');
  const {
    user, setUser, impersonating, setImpersonating,
  } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const postChangePassword = usePostChangePassword();
  const postEmailResetPassword = usePostEmailResetPassword();
  const postLogin = usePostLogin();
  const postResetPassword = usePostResetPassword();
  const [state, setState] = useState('SIGNIN');
  const [passwordMessages, setPasswordMessages] = useState([]);
  const [resetToken, setResetToken] = useState('');
  const [strength, setStrength] = useState(0);
  const classes = useStyles();
  const { isOn } = useContext(FlagContext);

  let changeFormik;
  let resetFormik;
  let sendResetFormik;
  let signinFormik;

  useEffect(() => {
    if ($stateParams.token) {
      setResetToken($stateParams.token);
      setState('RESETTING');
    }
  }, [$stateParams]);

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
      case 'RESETTING':
        setState('SIGNIN');
        break;
      default:
        setState('');
    }
  };

  const catchEnter = (e, target) => {
    if (e.key === 'Enter') {
      target(e);
    }
  };

  const toastWhenUsernameUsed = (enteredUsername, loggedInUser) => {
    if (enteredUsername !== loggedInUser.email) {
      const body = `Please use your email address "${loggedInUser.email}" instead of your username to log in. The use of a username to log in is being phased out, and will be removed at a future date`;
      enqueueSnackbar(body, { variant: 'warning' });
    }
  };

  const changePassword = () => {
    postChangePassword.mutate({
      oldPassword: changeFormik.values.oldPassword,
      newPassword: changeFormik.values.newPassword,
    }, {
      onSuccess: (response) => {
        if (response.passwordUpdated) {
          $analytics.eventTrack('Change Password', { category: 'Authentication' });
          setState('LOGGEDIN');
          changeFormik.resetForm();
          const body = 'Password successfully changed';
          enqueueSnackbar(body, { variant: 'success' });
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
          enqueueSnackbar(body, { variant: 'error' });
        }
      },
      onError: () => {
        const body = 'Error. Please check your credentials or contact the administrator';
        enqueueSnackbar(body, { variant: 'error' });
      },
    });
  };

  const getTitle = () => {
    switch (state) {
      case 'CHANGEPASSWORD': return `Change password${user ? ` for ${user.fullName}` : ''}`;
      case 'FORGOTPASSWORD': return 'Reset password';
      case 'IMPERSONATING': return `Impersonating ${user?.fullName}`;
      case 'LOGGEDIN': return user?.fullName ?? 'Logged in';
      case 'RESETTING': return 'Reset password';
      case 'SIGNIN': return 'Login required';
      default: return 'Unknown state';
    }
  };

  let sendReset;

  const login = () => {
    postLogin.mutate({
      userName: signinFormik.values.userName,
      password: signinFormik.values.password,
    }, {
      onSuccess: (response) => {
        authService.saveToken(response.token);
        console.log(authService.parseJwt(response.token));
        if (authService.parseJwt(response.token).iss === 'ONCCHPL') {
          console.log('calling getUserById');
          networkService.getUserById(authService.getUserId())
            .then((data) => {
              setUser(data);
              signinFormik.resetForm();
              $analytics.eventTrack('Log In', { category: 'Authentication' });
              authService.saveCurrentUser(data);
              Idle.watch();
              Keepalive.ping();
              $rootScope.$broadcast('loggedIn');
              dispatch('loggedIn');
              toastWhenUsernameUsed(signinFormik.values.userName, data);
            });
        } else {
          console.log('calling getCognitoUser');
          networkService.getCognitoUser(authService.getUserId())
            .then((data) => {
              setUser(data);
              signinFormik.resetForm();
              $analytics.eventTrack('Log In', { category: 'Authentication' });
              authService.saveCurrentUser(data);
              Idle.watch();
              //Keepalive.ping();
              $rootScope.$broadcast('loggedIn');
              dispatch('loggedIn');
            });
        }
      },
      onError: (error) => {
        if (error?.status === 461) {
          const body = 'Your account has not been confirmed, please check your email to confirm your account.';
          enqueueSnackbar(body, { variant: 'info' });
        } else if (error?.data?.error === 'The user is required to change their password on next login.') {
          const body = 'Password change is required';
          enqueueSnackbar(body, { variant: 'info' });
          sendResetFormik.values.email = signinFormik.values.userName;
          sendReset();
        } else {
          const body = 'Bad username and password combination or account is locked / disabled.';
          enqueueSnackbar(body, { variant: 'error' });
        }
      },
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

  const reset = () => {
    postResetPassword.mutate({
      token: resetToken,
      newPassword: resetFormik.values.newPassword,
    }, {
      onSuccess: (response) => {
        if (response.passwordUpdated) {
          setState('SIGNIN');
          resetFormik.resetForm();
          const body = 'Password successfully changed';
          enqueueSnackbar(body, { variant: 'success' });
        } else {
          let body = 'Your password was not changed. ';
          if (response.warning) {
            body += response.warning;
          }
          if (response.suggestions && response.suggestions.length > 0) {
            body += `Suggestion${response.suggestions.length > 1 ? 's' : ''}: ${response.suggestions.join(' ')}`;
          }
          if (!response.warning && (!response.suggestions || response.suggestions.length === 0)) {
            body += 'Your token was invalid or you need a stronger password.';
          }
          enqueueSnackbar(body, { variant: 'error' });
        }
      },
      onError: () => {
        const body = 'There was an error changing your password';
        enqueueSnackbar(body, { variant: 'error' });
      },
    });
  };

  sendReset = () => {
    postEmailResetPassword.mutate({ email: sendResetFormik.values.email }, {
      onSuccess: () => {
        $analytics.eventTrack('Send Reset Email', { category: 'Authentication' });
        setState('SIGNIN');
        sendResetFormik.resetForm();
        const body = `Password email reset sent to ${sendResetFormik.values.email}; please check your email`;
        enqueueSnackbar(body, { variant: 'success' });
      },
      onError: () => {
        const body = `Email could not be sent to ${sendResetFormik.values.email}`;
        enqueueSnackbar(body, { variant: 'error' });
      },
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

  const submitResetRequest = (e) => {
    e.stopPropagation();
    sendResetFormik.handleSubmit();
  };

  const submitSignin = (e) => {
    e.stopPropagation();
    signinFormik.handleSubmit();
  };

  const updateChangePassword = (event) => {
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

  const updateResetPassword = (event) => {
    const vals = ['chpl'];
    const passwordStrength = zxcvbn(event.target.value, vals);
    resetFormik.values.passwordStrength = passwordStrength.score;
    setStrength(passwordStrength.score);
    setPasswordMessages(
      [passwordStrength.feedback?.warning]
        .concat(passwordStrength.feedback?.suggestions)
        .filter((msg) => msg),
    );
    resetFormik.handleChange(event);
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
      newPassword: '',
      verificationPassword: '',
      passwordStrength: 0,
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: () => {
      reset();
    },
  });

  sendResetFormik = useFormik({
    validationSchema: sendResetSchema,
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
      <CardHeader className={classes.loginHeader} title={getTitle()} />
      <CardContent className={classes.grid}>
        {state === 'CHANGEPASSWORD'
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
               onKeyPress={(e) => catchEnter(e, submitChange)}
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
               onChange={updateChangePassword}
               onBlur={changeFormik.handleBlur}
               onKeyPress={(e) => catchEnter(e, submitChange)}
               error={changeFormik.touched.newPassword && !!changeFormik.errors.newPassword}
               helperText={changeFormik.touched.newPassword && changeFormik.errors.newPassword}
             />
             <PasswordStrengthMeter
               value={strength}
             />
             {passwordMessages.length > 0
              && (
                <ul>
                  {passwordMessages.map((msg) => (
                    <li key={msg}>{msg}</li>
                  ))}
                </ul>
              )}
             <ChplTextField
               type="password"
               id="password-verification"
               name="verificationPassword"
               label="Verify Password"
               required
               value={changeFormik.values.verificationPassword}
               onChange={changeFormik.handleChange}
               onBlur={changeFormik.handleBlur}
               onKeyPress={(e) => catchEnter(e, submitChange)}
               error={changeFormik.touched.verificationPassword && !!changeFormik.errors.verificationPassword}
               helperText={changeFormik.touched.verificationPassword && changeFormik.errors.verificationPassword}
             />
           </>
         )}
        {state === 'FORGOTPASSWORD'
         && (
           <ChplTextField
             id="email"
             name="email"
             label="Email"
             required
             value={sendResetFormik.values.email}
             onChange={sendResetFormik.handleChange}
             onBlur={sendResetFormik.handleBlur}
             onKeyPress={(e) => catchEnter(e, submitResetRequest)}
             error={sendResetFormik.touched.email && !!sendResetFormik.errors.email}
             helperText={sendResetFormik.touched.email && sendResetFormik.errors.email}
           />
         )}
        {state === 'RESETTING'
         && (
           <>
             <ChplTextField
               type="password"
               id="new-password"
               name="newPassword"
               label="New Password"
               required
               value={resetFormik.values.newPassword}
               onChange={updateResetPassword}
               onBlur={resetFormik.handleBlur}
               onKeyPress={(e) => catchEnter(e, submitReset)}
               error={resetFormik.touched.newPassword && !!resetFormik.errors.newPassword}
               helperText={resetFormik.touched.newPassword && resetFormik.errors.newPassword}
             />
             <PasswordStrengthMeter
               value={strength}
             />
             {passwordMessages.length > 0
              && (
                <ul>
                  {passwordMessages.map((msg) => (
                    <li key={msg}>{msg}</li>
                  ))}
                </ul>
              )}
             <ChplTextField
               type="password"
               id="password-verification"
               name="verificationPassword"
               label="Verify Password"
               required
               value={resetFormik.values.verificationPassword}
               onChange={resetFormik.handleChange}
               onBlur={resetFormik.handleBlur}
               onKeyPress={(e) => catchEnter(e, submitReset)}
               error={resetFormik.touched.verificationPassword && !!resetFormik.errors.verificationPassword}
               helperText={resetFormik.touched.verificationPassword && resetFormik.errors.verificationPassword}
             />
           </>
         )}
        {state === 'SIGNIN'
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
               onKeyPress={(e) => catchEnter(e, submitSignin)}
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
               onKeyPress={(e) => catchEnter(e, submitSignin)}
               error={signinFormik.touched.password && !!signinFormik.errors.password}
               helperText={signinFormik.touched.password && signinFormik.errors.password}
             />
           </>
         )}
        {state === 'IMPERSONATING'
         && (
           <Button
             fullWidth
             color="secondary"
             variant="contained"
             onClick={stopImpersonating}
             endIcon={<NotInterestedIcon />}
           >
             Stop Impersonating
           </Button>
         )}
        {(state === 'LOGGEDIN' || state === 'IMPERSONATING')
         && (
           <Button
             fullWidth
             color="primary"
             variant="contained"
             onClick={logout}
             endIcon={<ExitToAppIcon />}
           >
             Log Out
           </Button>
         )}
        {state === 'LOGGEDIN'
         && (
           <Button
             fullWidth
             color="secondary"
             variant="contained"
             onClick={(e) => { setState('CHANGEPASSWORD'); e.stopPropagation(); }}
             endIcon={<CreateIcon />}
           >
             Change Password
           </Button>
         )}
        {state === 'RESETTING'
         && (
           <Button
             fullWidth
             color="primary"
             variant="contained"
             onClick={submitReset}
             endIcon={<VpnKeyIcon />}
           >
             Confirm Password Reset
           </Button>
         )}
        {state === 'SIGNIN'
         && (
           <Button
             fullWidth
             color="primary"
             variant="contained"
             onClick={submitSignin}
             endIcon={<VpnKeyIcon />}
           >
             Log In
           </Button>
         )}
        {state === 'SIGNIN'
         && (
           <Button
             fullWidth
             color="secondary"
             variant="contained"
             onClick={(e) => { setState('FORGOTPASSWORD'); e.stopPropagation(); }}
             endIcon={<HelpOutlineIcon />}
           >
             Forgot Password
           </Button>
         )}
        {state === 'FORGOTPASSWORD'
         && (
           <Button
             fullWidth
             color="primary"
             variant="contained"
             onClick={submitResetRequest}
             endIcon={<SendIcon />}
           >
             Send reset email
           </Button>
         )}
        {state === 'CHANGEPASSWORD'
         && (
           <Button
             fullWidth
             color="primary"
             variant="contained"
             onClick={submitChange}
             endIcon={<VpnKeyIcon />}
           >
             Confirm new Password
           </Button>
         )}
        {(state === 'FORGOTPASSWORD' || state === 'CHANGEPASSWORD' || state === 'RESETTING')
         && (
           <Button
             fullWidth
             color="default"
             variant="contained"
             onClick={cancel}
             endIcon={<ClearIcon />}
           >
             Cancel
           </Button>
         )}
        {state === 'SIGNIN'
         && (
         <>
           <Typography variant="body2">
             This warning banner provides privacy and security notices consistent with applicable federal laws, directives, and other federal guidance for accessing this Government system, which includes all devices/storage media attached to this system. This system is provided for Government-authorized use only. Unauthorized or improper use of this system is prohibited and may result in disciplinary action and/or civil and criminal penalties.
           </Typography>
           <Typography variant="body2">
             At any time, and for any lawful Government purpose, the government may monitor, record, and audit your system usage and/or intercept, search and seize any communication or data transiting or stored on this system. Therefore, you have no reasonable expectation of privacy. Any communication or data transiting or stored on this system may be disclosed or used for any lawful Government purpose.
           </Typography>
         </>
         )}
      </CardContent>
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
