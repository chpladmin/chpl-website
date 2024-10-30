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

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
});

const validationSchema = yup.object({
  fullName: yup.string()
    .required('Full Name is required'),
  email: yup.string()
    .required('Email is required')
    .email('Enter a valid Email'),
});

function ChplCognitoUserCreate({ dispatch }) {
  const classes = useStyles();
  let formik;

  const create = () => {
    const user = {
      email: formik.values.email,
      fullName: formik.values.fullName,
    };
    dispatch('cognito-create', user);
  };

  formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
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
        id="email"
        name="email"
        label="Email"
        type="email"
        required
        value={formik.values.email}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.email && !!formik.errors.email}
        helperText={formik.touched.email && formik.errors.email}
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
