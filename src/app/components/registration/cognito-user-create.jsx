import React from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from 'components/util';
import { palette } from 'themes';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '8px',
    gridTemplateColumns: '1fr',
  },
  loginHeader: {
    backgroundColor: palette.secondary,
    padding: '16px',
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
    dispatch('create', user);
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
    <>
      <Card>
        <CardHeader className={classes.loginHeader} title="Create a new account" />
        <CardContent className={classes.content}>
          <Typography gutterBottom>
            <strong>
              Welcome to ONC&apos;s Certified Health IT Product List (CHPL).
            </strong>
          </Typography>
          <Typography variant="body1" gutterBottom>
            You have been invited to be an Administrator, which will allow you to manage your organization&apos;s information on the CHPL.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Please log in to your existing account to add any permissions and/or organizations, or create a new account by completing the form and selecting the &quot;create account&quot; button below.
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
          <Typography variant="body2">
            If you require accessibility assistance, please visit the
            {' '}
            <a href="https://inquiry.healthit.gov/support/plugins/servlet/loginfreeRedirMain?portalid=2&request=51">Health IT Feedback and Inquiry Portal</a>
            {' '}
            and select &quot;Certified Health IT Product List (CHPL)&quot; to submit a ticket.
          </Typography>
          <Button
            color="primary"
            variant="contained"
            id="create-account"
            disabled={!formik.isValid}
            onClick={formik.handleSubmit}
          >
            Create account
          </Button>
        </CardContent>
      </Card>
    </>
  );
}

export default ChplCognitoUserCreate;

ChplCognitoUserCreate.propTypes = {
  dispatch: func.isRequired,
};
