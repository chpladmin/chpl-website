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
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import ReactGA from 'react-ga4';

import ChplForgotPassword from './components/forgot-password';
import ChplLoggedIn from './components/logged-in';
import ChplSignin from './components/signin';
import PasswordStrengthMeter from './password-strength-meter';

import {
  usePostNewPasswordRequired,
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

function ChplCognitoLogin({ dispatch }) {
  const $rootScope = getAngularService('$rootScope');
  const Idle = getAngularService('Idle');
  const authService = getAngularService('authService');
  const { user, setUser } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const postNewPasswordRequired = usePostNewPasswordRequired();
  const [passwordMessages, setPasswordMessages] = useState([]);
  const [sessionId] = useState('');
  const [state, setState] = useState('SIGNIN');
  const [strength, setStrength] = useState(0);
  const classes = useStyles();

  let forceChangeFormik;

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
      userName: forceChangeFormik.values.userName,
      password: forceChangeFormik.values.newPassword,
      sessionId, // TODO - get this from login component
    }, {
      onSuccess: (response) => {
        authService.saveToken(response.accessToken);
        setUser(response.user);
        authService.saveCurrentUser(response.user);
        // TODO signinFormik.resetForm();
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
      default: return 'Unknown state';
    }
  };

  const handleDispatch = ({ action, payload }) => {
    console.log({ action, payload });
    switch (action) {
      case 'forceChangePassword':
        forceChangeFormik.setFieldValue('userName', payload);
        dispatch('forceChangePassword');
        setState('FORCECHANGEPASSWORD');
        break;
      case 'forgotPassword':
        setState('FORGOTPASSWORD');
        break;
      case 'isLoggedIn':
        setState('LOGGEDIN');
        break;
      case 'loggedIn':
        dispatch('loggedIn');
        setState('LOGGEDIN');
        break;
      case 'loggedOut':
        setState('SIGNIN');
        break;
      default:
        console.error(`No action found for ${action}`);
    }
  };

  const submitChange = (e) => {
    e.stopPropagation();
    forceChangeFormik.handleSubmit();
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
      userName: '',
      newPassword: '',
      verificationPassword: '',
      passwordStrength: 0,
    },
    onSubmit: () => {
      forceChangePassword();
    },
  });

  switch (state) {
    case 'FORGOTPASSWORD':
      return <ChplForgotPassword dispatch={handleDispatch} />;
    case 'LOGGEDIN':
      return <ChplLoggedIn dispatch={handleDispatch} />;
    case 'SIGNIN':
      return <ChplSignin dispatch={handleDispatch} />;
    default:
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
          </CardContent>
        </Card>
      );
  }
}

export default ChplCognitoLogin;

ChplCognitoLogin.propTypes = {
  dispatch: func,
};

ChplCognitoLogin.defaultProps = {
  dispatch: () => {},
};
