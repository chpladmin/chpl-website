import React from 'react';
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
import { ChplTextField } from '../util';

const useStyles = makeStyles(() => ({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridRowGap: '8px',
  },
}));

const validationSchema = yup.object({
  userName: yup.string()
    .required('Email (or User Name) is required'),
  password: yup.string()
    .required('Password is required'),
});

function ChplLogin(props) {
  /* eslint-disable react/destructuring-assignment */
  const $analytics = getAngularService('$analytics');
  const $rootScope = getAngularService('$rootScope');
  const Idle = getAngularService('Idle');
  const Keepalive = getAngularService('Keepalive');
  const authService = getAngularService('authService');
  const networkService = getAngularService('networkService');
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  let formik;

  const login = () => {
    networkService.login({ userName: formik.values.userName, password: formik.values.password })
      .then(() => {
        networkService.getUserById(authService.getUserId())
          .then((user) => {
            $analytics.eventTrack('Log In', { category: 'Authentication' });
            authService.saveCurrentUser(user);
            Idle.watch();
            Keepalive.ping();
            $rootScope.$broadcast('loggedIn');
            props.dispatch('loggedIn');
          });
      });
  };

  formik = useFormik({
    validationSchema,
    initialValues: {
      userName: '',
      password: '',
    },
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: () => {
      login();
    },
  });

  return (
    <Card>
      <CardHeader title="Login required" />
      <CardContent className={classes.grid}>
        <ChplTextField
          id="user-name"
          name="userName"
          label="Email (or User Name)"
          required
          value={formik.values.userName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
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
          error={formik.touched.password && !!formik.errors.password}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Typography variant="body2">
          This warning banner provides privacy and security notices consistent with applicable federal laws, directives, and other federal guidance for accessing this Government system, which includes all devices/storage media attached to this system. This system is provided for Government-authorized use only. Unauthorized or improper use of this system is prohibited and may result in disciplinary action and/or civil and criminal penalties. At any time, and for any lawful Government purpose, the government may monitor, record, and audit your system usage and/or intercept, search and seize any communication or data transiting or stored on this system. Therefore, you have no reasonable expectation of privacy. Any communication or data transiting or stored on this system may be disclosed or used for any lawful Government purpose.
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          onClick={formik.handleSubmit}
        >
          Log In
        </Button>
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
