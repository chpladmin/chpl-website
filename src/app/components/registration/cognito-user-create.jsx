import React, { useState } from 'react';
import {
  Button,
  Paper,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { PasswordStrengthMeter } from 'components/login';
import { ChplTextField } from 'components/util';

const zxcvbn = require('zxcvbn');

const useStyles = makeStyles(() => ({
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
}));

const phoneRegExp = /\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/;

const validationSchema = yup.object({
  fullName: yup.string()
    .required('Full Name is required'),
  email: yup.string()
    .required('Email is required')
    .email('Enter a valid Email'),
  phoneNumber: yup.string()
    .required('Phone Number is required')
    .matches(phoneRegExp, 'Phone number is not valid'),
  password: yup.string()
    .required('Password is required')
    .test(
      'password-strength',
      'Password is not strong enough',
      (value, context) => context.parent.passwordStrength >= 3,
    ),
  passwordVerify: yup.string()
    .required('Verify Password is required')
    .test(
      'password-matches',
      'Verify Password does not match Password',
      (value, context) => value === context.parent.password,
    ),
});

function ChplCognitoUserCreate({ dispatch }) {
  const [passwordMessages, setPasswordMessages] = useState([]);
  const [strength, setStrength] = useState(0);
  const classes = useStyles();

  let formik;

  const create = () => {
    const user = {
      email: formik.values.email,
      fullName: formik.values.fullName,
      password: formik.values.password,
      passwordVerify: formik.values.passwordVerify,
      phoneNumber: formik.values.phoneNumber,
    };
    dispatch('cognito-create', user);
  };

  const updatePassword = (event) => {
    const vals = ['chpl'];
    if (formik.values.fullName) { vals.push(formik.values.fullName); }
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
      fullName: '',
      phoneNumber: '',
      email: '',
      password: '',
      passwordVerify: '',
      passwordStrength: 0,
    },
    onSubmit: () => {
      create();
    },
    validationSchema,
  });

  return (
    <Paper className={classes.content}>
      <Typography>
        Welcome to ONC&apos;s Certified Health IT Product List (CHPL). You have been invited to be an Administrator, which will allow you to manage your organization&apos;s information on the CHPL. Please log in to your existing account to add any permissions and/or organizations, or create a new account by completing the form and selecting the &quot;create account&quot; button below.
      </Typography>
      <Typography>
        Create a new Cognito account.
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
        id="phone-number"
        name="phoneNumber"
        label="Phone Number"
        required
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
        id="password"
        name="password"
        label="Password"
        required
        value={formik.values.password}
        onChange={updatePassword}
        onBlur={formik.handleBlur}
        error={formik.touched.password && !!formik.errors.password}
        helperText={formik.touched.password && formik.errors.password}
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
        id="password-verify"
        name="passwordVerify"
        label="Password Verify"
        required
        value={formik.values.passwordVerify}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.passwordVerify && !!formik.errors.passwordVerify}
        helperText={formik.touched.passwordVerify && formik.errors.passwordVerify}
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
        and select &quot;Certified Health IT Product List (CHPL)&quot; to submit a ticket.
      </Typography>
    </Paper>
  );
}

export default ChplCognitoUserCreate;

ChplCognitoUserCreate.propTypes = {
  dispatch: func.isRequired,
};
