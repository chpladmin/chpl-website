import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import CreateIcon from '@material-ui/icons/Create';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import ReactGA from 'react-ga4';

import PasswordStrengthMeter from './password-strength-meter';

import {
  usePostChangePassword,
  usePostCognitoLogin,
} from 'api/auth';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import { ChplTextField } from 'components/util';

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

const signinSchema = yup.object({
  password: yup.string()
    .required('Password is required'),
  userName: yup.string()
    .required('Email is required'),
});

function ChplCognitoLogin({ dispatch }) {
  const $rootScope = getAngularService('$rootScope');
  const Idle = getAngularService('Idle');
  const authService = getAngularService('authService');
  const { user, setUser } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const postChangePassword = usePostChangePassword();
  const postLogin = usePostCognitoLogin();
  const [passwordMessages, setPasswordMessages] = useState([]);
  const [state, setState] = useState('SIGNIN');
  const [strength, setStrength] = useState(0);
  const classes = useStyles();

  let changeFormik;
  let signinFormik;

  useEffect(() => {
    if (user?.fullName) {
      setState('LOGGEDIN');
    }
  }, [user]);

  const cancel = (e) => {
    e.stopPropagation();
    switch (state) {
      case 'CHANGEPASSWORD':
        setState('LOGGEDIN');
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

  const changePassword = () => {
    postChangePassword.mutate({
      oldPassword: changeFormik.values.oldPassword,
      newPassword: changeFormik.values.newPassword,
    }, {
      onSuccess: (response) => {
        if (response.passwordUpdated) {
          ReactGA.event({ action: 'Change Password', category: 'Authentication', label: 'test' });
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
      case 'LOGGEDIN': return user?.fullName ?? 'Logged in';
      case 'SIGNIN': return 'Cognito login required';
      default: return 'Unknown state';
    }
  };

  const login = () => {
    postLogin.mutate({
      userName: signinFormik.values.userName,
      password: signinFormik.values.password,
    }, {
      onSuccess: (response) => {
        authService.saveToken(response.accessToken);
        setUser(response.user);
        authService.saveCurrentUser(response.user);
        signinFormik.resetForm();
        ReactGA.event({ action: 'Log In', category: 'Authentication' });
        Idle.watch();
        $rootScope.$broadcast('loggedIn');
        dispatch('loggedIn');
        setState('LOGGEDIN');
      },
      onError: (error) => {
        if (error?.status === 461) {
          const body = 'Your account has not been confirmed, please check your email to confirm your account.';
          enqueueSnackbar(body, { variant: 'info' });
        } else if (error?.status === 470) {
          const body = 'Password change is required';
          enqueueSnackbar(body, { variant: 'info' });
          setState('CHANGEPASSWORD');
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
    ReactGA.event({ action: 'Log Out', category: 'Authentication' });
    Idle.unwatch();
    $rootScope.$broadcast('loggedOut');
  };

  const submitChange = (e) => {
    e.stopPropagation();
    changeFormik.handleSubmit();
  };

  const submitSignin = (e) => {
    e.stopPropagation();
    signinFormik.handleSubmit();
  };

  const updateChangePassword = (event) => {
    const vals = ['chpl'];
    if (user?.fullName) { vals.push(user.fullName); }
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

  signinFormik = useFormik({
    validationSchema: signinSchema,
    initialValues: {
      password: '',
      userName: '',
    },
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
        {state === 'SIGNIN'
         && (
           <>
             <ChplTextField
               id="user-name"
               name="userName"
               label="Email"
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
        {(state === 'LOGGEDIN')
         && (
           <Button
             fullWidth
             color="primary"
             variant="contained"
             onClick={logout}
             endIcon={<ExitToAppIcon />}
           >
             Log Out (Cognito)
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
        {state === 'CHANGEPASSWORD'
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
           <Button
             fullWidth
             color="primary"
             variant="contained"
             onClick={submitSignin}
             endIcon={<VpnKeyIcon />}
           >
             Log In (Cognito)
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

export default ChplCognitoLogin;

ChplCognitoLogin.propTypes = {
  dispatch: func,
};

ChplCognitoLogin.defaultProps = {
  dispatch: () => {},
};
