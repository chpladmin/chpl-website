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
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import SendIcon from '@material-ui/icons/Send';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import ReactGA from 'react-ga4';

import PasswordStrengthMeter from './password-strength-meter';

import {
  usePostNewPasswordRequired,
  usePostCognitoLogin,
  usePostForgotPassword,
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

const forceChangeSchema = yup.object({
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

const forgotPasswordSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Email format is invalid'),
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
  const postForgotPassword = usePostForgotPassword();
  const postLogin = usePostCognitoLogin();
  const postNewPasswordRequired = usePostNewPasswordRequired();
  const [passwordMessages, setPasswordMessages] = useState([]);
  const [sessionId, setSessionId] = useState('');
  const [state, setState] = useState('SIGNIN');
  const [strength, setStrength] = useState(0);
  const classes = useStyles();

  let forceChangeFormik;
  let forgotPasswordFormik;
  let signinFormik;

  useEffect(() => {
    if (user?.fullName) {
      setState('LOGGEDIN');
    }
  }, [user]);

  const cancel = (e) => {
    e.stopPropagation();
    switch (state) {
      case 'FORCECHANGEPASSWORD':
        setState('LOGGEDIN');
        break;
      case 'FORGOTPASSWORD':
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

  const forceChangePassword = () => {
    postNewPasswordRequired.mutate({
      userName: signinFormik.values.userName,
      password: forceChangeFormik.values.newPassword,
      sessionId,
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
        console.error(error);
        const body = 'Error. Please check your credentials or contact the administrator';
        enqueueSnackbar(body, { variant: 'error' });
      },
    });
  };

  const getTitle = () => {
    switch (state) {
      case 'FORCECHANGEPASSWORD': return `Change password${user ? ` for ${user.fullName}` : ''}`;
      case 'FORGOTPASSWORD': return 'Forgotten password';
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
        if (error?.response?.status === 470) {
          setSessionId(error?.response?.data?.sessionId);
          dispatch('forceChangePassword');
          setState('FORCECHANGEPASSWORD');
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

  const sendForgottenPasswordEmail = () => {
    postForgotPassword.mutate({ userName: forgotPasswordFormik.values.email }, {
      onSuccess: () => {
        ReactGA.event({ action: 'Send Forgotten Password Email', category: 'Authentication', label: 'test' });
        setState('SIGNIN');
        forgotPasswordFormik.resetForm();
        const body = `Forgotten password email sent to ${forgotPasswordFormik.values.email}; please check your email`;
        enqueueSnackbar(body, { variant: 'success' });
      },
      onError: () => {
        const body = `Email could not be sent to ${forgotPasswordFormik.values.email}`;
        enqueueSnackbar(body, { variant: 'error' });
      },
    });
  };

  const submitChange = (e) => {
    e.stopPropagation();
    forceChangeFormik.handleSubmit();
  };

  const submitForgottenPasswordRequest = (e) => {
    e.stopPropagation();
    forgotPasswordFormik.handleSubmit();
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
    forceChangeFormik.values.passwordStrength = passwordStrength.score;
    setStrength(passwordStrength.score);
    setPasswordMessages(
      [passwordStrength.feedback?.warning]
        .concat(passwordStrength.feedback?.suggestions)
        .filter((msg) => msg),
    );
    forceChangeFormik.handleChange(event);
  };

  forceChangeFormik = useFormik({
    validationSchema: forceChangeSchema,
    initialValues: {
      newPassword: '',
      verificationPassword: '',
      passwordStrength: 0,
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: () => {
      forceChangePassword();
    },
  });

  forgotPasswordFormik = useFormik({
    validationSchema: forgotPasswordSchema,
    initialValues: {
      email: '',
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: () => {
      sendForgottenPasswordEmail();
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
             <Typography>To implement later</Typography>
           </>
         )}
        {state === 'FORCECHANGEPASSWORD'
         && (
           <>
             <ChplTextField
               type="password"
               id="new-password"
               name="newPassword"
               label="New Password"
               required
               value={forceChangeFormik.values.newPassword}
               onChange={updateChangePassword}
               onBlur={forceChangeFormik.handleBlur}
               onKeyPress={(e) => catchEnter(e, submitChange)}
               error={forceChangeFormik.touched.newPassword && !!forceChangeFormik.errors.newPassword}
               helperText={forceChangeFormik.touched.newPassword && forceChangeFormik.errors.newPassword}
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
               value={forceChangeFormik.values.verificationPassword}
               onChange={forceChangeFormik.handleChange}
               onBlur={forceChangeFormik.handleBlur}
               onKeyPress={(e) => catchEnter(e, submitChange)}
               error={forceChangeFormik.touched.verificationPassword && !!forceChangeFormik.errors.verificationPassword}
               helperText={forceChangeFormik.touched.verificationPassword && forceChangeFormik.errors.verificationPassword}
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
             value={forgotPasswordFormik.values.email}
             onChange={forgotPasswordFormik.handleChange}
             onBlur={forgotPasswordFormik.handleBlur}
             onKeyPress={(e) => catchEnter(e, submitForgottenPasswordRequest)}
             error={forgotPasswordFormik.touched.email && !!forgotPasswordFormik.errors.email}
             helperText={forgotPasswordFormik.touched.email && forgotPasswordFormik.errors.email}
           />
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
        {state === 'FORCECHANGEPASSWORD'
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
             onClick={submitForgottenPasswordRequest}
             endIcon={<SendIcon />}
           >
             Send forgotten password email
           </Button>
         )}
        {state === 'FORGOTPASSWORD'
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

export default ChplCognitoLogin;

ChplCognitoLogin.propTypes = {
  dispatch: func,
};

ChplCognitoLogin.defaultProps = {
  dispatch: () => {},
};
