import React, { useState } from 'react';
import {
  func,
} from 'prop-types';
import {
  Button,
  Paper,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import theme from '../../themes/theme';
import { ChplTextField } from '../util';
import { PasswordStrengthMeter } from '../login';

const zxcvbn = require('zxcvbn');

const useStyles = makeStyles(() => ({
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
}));

const validationSchema = yup.object({
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
  fullName: yup.string()
    .required('Full Name is required'),
  email: yup.string()
    .required('Email is required')
    .email('Enter a valid Email'),
});

function ChplUserCreate(props) {
  const [passwordMessages, setPasswordMessages] = useState([]);
  const [strength, setStrength] = useState(0);
  const classes = useStyles();

  let formik;

  const create = () => {
    const user = {
      email: formik.values.email,
      friendlyName: formik.values.friendlyName,
      fullName: formik.values.fullName,
      password: formik.values.newPassword,
      passwordVerify: formik.values.verificationPassword,
      phoneNumber: formik.values.phoneNumber,
      title: formik.values.title,
    };
    props.dispatch('create', user);
  };

  const updatePassword = (event) => {
    const vals = ['chpl'];
    if (formik.values.fullName) { vals.push(formik.values.fullName); }
    if (formik.values.friendlyName) { vals.push(formik.values.friendlyName); }
    if (formik.values.email) { vals.push(formik.values.email); }
    if (formik.values.phoneNumber) { vals.push(formik.values.phoneNumber); }
    const passwordStrength = zxcvbn(event.target.value, vals);
    formik.values.passwordStrength = passwordStrength.score;
    setStrength(passwordStrength.score);
    setPasswordMessages(
      [passwordStrength.feedback?.warning]
        .concat(passwordStrength.feedback?.suggestions)
        .filter((msg) => msg),
    );
    formik.handleChange(event);
  };

  formik = useFormik({
    initialValues: {
      newPassword: '',
      verificationPassword: '',
      passwordStrength: 0,
      fullName: '',
      friendlyName: '',
      title: '',
      phoneNumber: '',
      email: '',
    },
    onSubmit: () => {
      create();
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  return (
    <ThemeProvider theme={theme}>
      <Paper className={classes.content}>
        <Typography>
          Welcome to ONC’s Certified Health IT Product List (CHPL). You have been invited to be an Administrator, which will allow you to manage your organization’s information on the CHPL. Please log in to your existing account to add any permissions and/or organizations, or create a new account by completing the form and selecting the ‘create account’ button below.
        </Typography>
        <Typography>
          Create a new account.
        </Typography>
        <ChplTextField
          id="full-name"
          name="fullName"
          label="Full Name"
          required
          value={formik.values.fullName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.fullName && !!formik.errors.fullName}
          helperText={formik.touched.fullName && formik.errors.fullName}
        />
        <ChplTextField
          id="friendly-name"
          name="friendlyName"
          label="Friendly Name"
          value={formik.values.friendlyName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.friendlyName && !!formik.errors.friendlyName}
          helperText={formik.touched.friendlyName && formik.errors.friendlyName}
        />
        <ChplTextField
          id="title"
          name="title"
          label="Title"
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && !!formik.errors.title}
          helperText={formik.touched.title && formik.errors.title}
        />
        <ChplTextField
          id="phone-number"
          name="phoneNumber"
          label="Phone Number"
          value={formik.values.phoneNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
          helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
        />
        <ChplTextField
          id="email"
          name="email"
          label="Email"
          required
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && !!formik.errors.email}
          helperText={formik.touched.email && formik.errors.email}
        />
        <ChplTextField
          type="password"
          id="new-password"
          name="newPassword"
          label="Password"
          required
          value={formik.values.newPassword}
          onChange={updatePassword}
          onBlur={formik.handleBlur}
          error={formik.touched.newPassword && !!formik.errors.newPassword}
          helperText={formik.touched.newPassword && formik.errors.newPassword}
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
          label="Verify Password"
          required
          value={formik.values.verificationPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.verificationPassword && !!formik.errors.verificationPassword}
          helperText={formik.touched.verificationPassword && formik.errors.verificationPassword}
        />
        <Button
          color="primary"
          variant="contained"
          id="create-account"
          disabled={!formik.isValid}
          onClick={formik.handleSubmit}
        >
          Create account
        </Button>
        <Typography>
          If you require accessibility assistance, please visit the
          {' '}
          <a href="https://inquiry.healthit.gov/support/plugins/servlet/loginfreeRedirMain?portalid=2&request=51">Health IT Feedback and Inquiry Portal</a>
          {' '}
          and select “Certified Health IT Product List (CHPL)” to submit a ticket.
        </Typography>
      </Paper>
    </ThemeProvider>
  );
}

export default ChplUserCreate;

ChplUserCreate.propTypes = {
  dispatch: func.isRequired,
};
