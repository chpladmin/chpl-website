import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import ClearIcon from '@material-ui/icons/Clear';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import CreateIcon from '@material-ui/icons/Create';
import SendIcon from '@material-ui/icons/Send';
import NotInterestedIcon from '@material-ui/icons/NotInterested';

import { getAngularService } from '../../services/angular-react-helper';
import { UserContext } from '../../shared/contexts';
import { ChplTextField } from '../util';

import PasswordStrengthMeter from './password-strength-meter';

const zxcvbn = require('zxcvbn');

const useStyles = makeStyles(() => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridRowGap: '16px',
  },
  loginHeader: {
    backgroundColor: '#ffffff',
    padding: '16px 0px 0px 16px',
  },
  iconSpacing: {
    marginLeft: '4px',
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
  userName: yup.string()
    .required('Email (or User Name) is required'),
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

function ChplLogin(props) {
  /* eslint-disable react/destructuring-assignment */
  const $analytics = getAngularService('$analytics');
  const $rootScope = getAngularService('$rootScope');
  const $stateParams = getAngularService('$stateParams');
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
  const [resetToken, setResetToken] = useState('');
  const [strength, setStrength] = useState(0);
  const classes = useStyles();
  let changeFormik;
  let resetFormik;
  let sendResetFormik;
  let signinFormik;
  /* eslint-enable react/destructuring-assignment */

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
      toaster.pop({
        header: 'Warning',
        type: 'warning',
        body: `Please use your email address "${loggedInUser.email}" instead of your username to log in. The use of a username to log in is being phased out, and will be removed at a future date. If your email address is not valid, please update it as soon as possible`,
      });
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
    if (!user?.fullName) { // I think this if statement should go away when we only have one UserContext
      if (state !== 'SIGNIN' && state !== 'RESETTING' && state !== 'FORGOTPASSWORD') {
        setState('SIGNIN');
      }
      return 'Login required';
    }
    switch (state) {
      case 'CHANGEPASSWORD': return `Change password for ${user.fullName}`;
      case 'FORGOTPASSWORD': return 'Reset password';
      case 'IMPERSONATING': return `Impersonating ${user.fullName}`;
      case 'LOGGEDIN': return user.fullName;
      case 'RESETTING': return 'Reset password';
      case 'SIGNIN': return 'Login required';
      default: return 'Unknown state';
    }
  };

  let sendReset;

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
            toastWhenUsernameUsed(signinFormik.values.userName, data);
          });
      }, (error) => {
        if (error?.data?.error === 'The user is required to change their password on next login.') {
          const body = 'Password change is required';
          toaster.pop({
            type: 'info',
            body,
          });
          sendResetFormik.values.email = signinFormik.values.userName;
          sendReset();
        } else {
          const body = 'Bad username and password combination or account is locked / disabled.';
          toaster.pop({
            type: 'error',
            body,
          });
        }
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
    networkService.resetPassword({
      token: resetToken,
      userName: resetFormik.values.userName,
      newPassword: resetFormik.values.newPassword,
    })
      .then((response) => {
        if (response.passwordUpdated) {
          setState('SIGNIN');
          resetFormik.resetForm();
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
            body += 'Your token was invalid or you need a stronger password.';
          }
          toaster.pop({
            type: 'error',
            body,
          });
        }
      }, () => {
        const body = 'There was an error changing your password';
        toaster.pop({
          type: 'error',
          body,
        });
      });
  };

  sendReset = () => {
    networkService.emailResetPassword({ email: sendResetFormik.values.email })
      .then(() => {
        $analytics.eventTrack('Send Reset Email', { category: 'Authentication' });
        setState('SIGNIN');
        sendResetFormik.resetForm();
        toaster.pop({
          type: 'success',
          body: `Password email reset sent to ${sendResetFormik.values.email}; please check your email`,
        });
      }, () => {
        const body = `Email could not be sent to ${sendResetFormik.values.email}`;
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
      userName: '',
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
               label="Verification Password"
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
               id="user-name"
               name="userName"
               label="Email (or User Name)"
               required
               value={resetFormik.values.userName}
               onChange={resetFormik.handleChange}
               onBlur={resetFormik.handleBlur}
               onKeyPress={(e) => catchEnter(e, submitReset)}
               error={resetFormik.touched.userName && !!resetFormik.errors.userName}
               helperText={resetFormik.touched.userName && resetFormik.errors.userName}
             />
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
               label="Verification Password"
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
           >
             Stop Impersonating
             <NotInterestedIcon className={classes.iconSpacing} />
           </Button>
         )}
        {(state === 'LOGGEDIN' || state === 'IMPERSONATING')
         && (
           <Button
             fullWidth
             color="primary"
             variant="contained"
             onClick={logout}
           >
             Log Out
             <ExitToAppIcon className={classes.iconSpacing} />
           </Button>
         )}
        {state === 'LOGGEDIN'
         && (
           <Button
             fullWidth
             color="secondary"
             variant="contained"
             onClick={(e) => { setState('CHANGEPASSWORD'); e.stopPropagation(); }}
           >
             Change Password
             <CreateIcon className={classes.iconSpacing} />
           </Button>
         )}
        {state === 'RESETTING'
         && (
           <Button
             fullWidth
             color="primary"
             variant="contained"
             onClick={submitReset}
           >
             Confirm Password Reset
             <VpnKeyIcon className={classes.iconSpacing} />
           </Button>
         )}
        {state === 'SIGNIN'
         && (
           <Button
             fullWidth
             color="primary"
             variant="contained"
             onClick={submitSignin}
           >
             Log In
             <VpnKeyIcon className={classes.iconSpacing} />
           </Button>
         )}
        {state === 'SIGNIN'
         && (
           <Button
             fullWidth
             color="secondary"
             variant="contained"
             onClick={(e) => { setState('FORGOTPASSWORD'); e.stopPropagation(); }}
           >
             Forgot Password
             <HelpOutlineIcon className={classes.iconSpacing} />
           </Button>
         )}
        {state === 'FORGOTPASSWORD'
         && (
           <Button
             fullWidth
             color="primary"
             variant="contained"
             onClick={submitResetRequest}
           >
             Send reset email
             <SendIcon className={classes.iconSpacing} />
           </Button>
         )}
        {state === 'CHANGEPASSWORD'
         && (
           <Button
             fullWidth
             color="primary"
             variant="contained"
             onClick={submitChange}
           >
             Confirm new Password
             <VpnKeyIcon className={classes.iconSpacing} />
           </Button>
         )}
        {(state === 'FORGOTPASSWORD' || state === 'CHANGEPASSWORD' || state === 'RESETTING')
         && (
           <Button
             fullWidth
             color="default"
             variant="contained"
             onClick={cancel}
           >
             Cancel
             <ClearIcon className={classes.iconSpacing} />
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
