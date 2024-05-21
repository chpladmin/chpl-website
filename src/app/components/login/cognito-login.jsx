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
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import ReactGA from 'react-ga4';

import { usePostCognitoLogin } from 'api/auth';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import { ChplTextField } from 'components/util';

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

const signinSchema = yup.object({
  password: yup.string()
    .required('Password is required'),
  userName: yup.string()
    .required('Email (or User Name) is required'),
});

function ChplCognitoLogin({ dispatch }) {
  const $rootScope = getAngularService('$rootScope');
  const Idle = getAngularService('Idle');
  const authService = getAngularService('authService');
  const networkService = getAngularService('networkService');
  const {
    user, setUser,
  } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const postLogin = usePostCognitoLogin();
  const [state, setState] = useState('SIGNIN');
  const classes = useStyles();

  let signinFormik;

  useEffect(() => {
    if (user?.fullName) {
      setState('LOGGEDIN');
    }
  }, [user]);

  const catchEnter = (e, target) => {
    if (e.key === 'Enter') {
      target(e);
    }
  };

  const getTitle = () => {
    switch (state) {
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
        authService.saveToken(response.token);
        networkService.getCognitoUser(authService.getUserId())
          .then((data) => {
            setUser(data);
            signinFormik.resetForm();
            ReactGA.event({ action: 'Log In', category: 'Authentication' });
            authService.saveCurrentUser(data);
            Idle.watch();
            $rootScope.$broadcast('loggedIn');
            dispatch('loggedIn');
          });
        authService.saveToken(response.token);
      },
      onError: (error) => {
        if (error?.status === 461) {
          const body = 'Your account has not been confirmed, please check your email to confirm your account.';
          enqueueSnackbar(body, { variant: 'info' });
        } else if (error?.data?.error === 'The user is required to change their password on next login.') {
          const body = 'Password change is required';
          enqueueSnackbar(body, { variant: 'info' });
          /*
          sendResetFormik.values.email = signinFormik.values.userName;
          sendReset();
          */
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

  const submitSignin = (e) => {
    e.stopPropagation();
    signinFormik.handleSubmit();
  };

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
