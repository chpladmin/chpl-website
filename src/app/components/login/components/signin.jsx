import React, { useContext } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { setAuthTokens } from 'axios-jwt';

import { usePostCognitoLogin } from 'api/auth';
import { ChplTextField } from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { eventTrack } from 'services/analytics.service';
import { UserContext, useAnalyticsContext } from 'shared/contexts';

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

const validationSchema = yup.object({
  password: yup.string()
    .required('Password is required'),
  userName: yup.string()
    .required('Email is required'),
});

function ChplSignin({ dispatch }) {
  const $rootScope = getAngularService('$rootScope');
  const Idle = getAngularService('Idle');
  const authService = getAngularService('authService');
  const { setUser } = useContext(UserContext);
  const { analytics } = useAnalyticsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostCognitoLogin();
  const classes = useStyles();

  let formik;

  const catchEnter = (e, target) => {
    if (e.key === 'Enter') {
      target(e);
    }
  };

  const forgotPassword = (e) => {
    e.stopPropagation();
    eventTrack({
      ...analytics,
      event: 'Forgot Password',
      category: 'Authentication',
    });
    dispatch({ action: 'forgotPassword' });
  };

  const login = () => {
    mutate({
      userName: formik.values.userName,
      password: formik.values.password,
    }, {
      onSuccess: (response) => {
        eventTrack({
          ...analytics,
          event: 'Log In',
          category: 'Authentication',
          group: response.user.role,
        });
        authService.saveToken(response.accessToken);
        authService.saveRefreshToken(response.refreshToken);
        setAuthTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
        setUser(response.user);
        authService.saveCurrentUser(response.user);
        formik.resetForm();
        Idle.watch();
        $rootScope.$broadcast('loggedIn');
        dispatch({ action: 'loggedIn' });
      },
      onError: (error) => {
        if (error?.response?.status === 470) {
          dispatch({
            action: 'forceChangePassword',
            payload: {
              userName: formik.values.userName,
              sessionId: error?.response?.data?.sessionId,
            },
          });
        } else if (error?.response?.status === 471) {
          const body = 'For security reasons, all users are being asked to reset their password. Please use the Forgot Password functionality to complete this process.';
          enqueueSnackbar(body, { variant: 'error' });
          dispatch({
            action: 'forgotPassword',
            payload: {
              userName: formik.values.userName,
            },
          });
        } else {
          const body = 'Bad username and password combination or account is locked / disabled.';
          enqueueSnackbar(body, { variant: 'error' });
        }
      },
    });
  };

  const submitSignin = (e) => {
    e.stopPropagation();
    formik.handleSubmit();
  };

  formik = useFormik({
    validationSchema,
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
      <CardHeader className={classes.loginHeader} title="Login required" />
      <CardContent className={classes.grid}>
        <ChplTextField
          id="user-name"
          name="userName"
          label="Email"
          required
          value={formik.values.userName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onKeyPress={(e) => catchEnter(e, submitSignin)}
          error={formik.touched.userName && !!formik.errors.userName}
          helperText={formik.touched.userName && formik.errors.userName}
        />
        <ChplTextField
          type="password"
          id="password"
          name="password"
          label="Password"
          required
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onKeyPress={(e) => catchEnter(e, submitSignin)}
          error={formik.touched.password && !!formik.errors.password}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button
          fullWidth
          color="primary"
          variant="contained"
          onClick={submitSignin}
          endIcon={<VpnKeyIcon />}
        >
          Log In
        </Button>
        <Button
          fullWidth
          color="secondary"
          variant="contained"
          onClick={forgotPassword}
          endIcon={<HelpOutlineIcon />}
        >
          Forgot Password
        </Button>
        <Typography variant="body2">
          This warning banner provides privacy and security notices consistent with applicable federal laws, directives, and other federal guidance for accessing this Government system, which includes all devices/storage media attached to this system. This system is provided for Government-authorized use only. Unauthorized or improper use of this system is prohibited and may result in disciplinary action and/or civil and criminal penalties.
        </Typography>
        <Typography variant="body2">
          At any time, and for any lawful Government purpose, the government may monitor, record, and audit your system usage and/or intercept, search and seize any communication or data transiting or stored on this system. Therefore, you have no reasonable expectation of privacy. Any communication or data transiting or stored on this system may be disclosed or used for any lawful Government purpose.
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ChplSignin;

ChplSignin.propTypes = {
  dispatch: func.isRequired,
};
