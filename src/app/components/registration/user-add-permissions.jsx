import React from 'react';
import {
  Button,
  Paper,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from 'components/util';

const validationSchema = yup.object({
  password: yup.string()
    .required('Password is required'),
  email: yup.string()
    .required('Email (or User Name) is required'),
});

const useStyles = makeStyles(() => ({
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
}));

function ChplUserAddPermissions({ dispatch }) {
  const classes = useStyles();
  let formik;

  const login = () => {
    const user = {
      email: formik.values.email,
      password: formik.values.password,
    };
    dispatch('authorize', user);
  };

  formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: () => {
      login();
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  return (
    <Paper className={classes.content}>
      <Typography>
        Welcome to ONC’s Certified Health IT Product List (CHPL). You have been invited to be an Administrator, which will allow you to manage your organization’s information on the CHPL. Please log in to your existing account to add any permissions and/or organizations, or create a new account by selecting the ‘create a new account’ button below.
      </Typography>
      <Typography>
        Log in to your existing account
      </Typography>
      <ChplTextField
        id="email"
        name="email"
        label="Email (or User Name)"
        required
        value={formik.values.userName}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && !!formik.errors.email}
        helperText={formik.touched.email && formik.errors.email}
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
      <Button
        color="primary"
        variant="contained"
        id="login-to-account"
        disabled={!formik.isValid}
        onClick={formik.handleSubmit}
      >
        Log in to your account
      </Button>
      <Typography>
        If you require accessibility assistance, please visit the
        {' '}
        <a href="https://inquiry.healthit.gov/support/plugins/servlet/loginfreeRedirMain?portalid=2&request=51">Health IT Feedback and Inquiry Portal</a>
        {' '}
        and select “Certified Health IT Product List (CHPL)” to submit a ticket.
      </Typography>
    </Paper>
  );
}

export default ChplUserAddPermissions;

ChplUserAddPermissions.propTypes = {
  dispatch: func.isRequired,
};
