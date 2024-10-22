import React from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  TextField,
  Typography,
  makeStyles,
} from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { eventTrack } from 'services/analytics.service';
import { getAngularService } from 'services/angular-react-helper';
import { useAnalyticsContext } from 'shared/contexts';

const useStyles = makeStyles({
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridRowGap: '16px',
  },
  longLabelFix: {
    paddingRight: '4px',
    backgroundColor: '#ffffff',
  },
});

const validationSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Enter a valid email'),
  nameOrganization: yup.string()
    .required('Name or Organization is required'),
});

function ChplApiKeyRegistration() {
  const networkService = getAngularService('networkService');
  const toaster = getAngularService('toaster');
  const { analytics } = useAnalyticsContext();
  const classes = useStyles();
  let formik = {};

  const writeAnalytics = () => {
    eventTrack({
      ...analytics,
      event: 'Register for API Key',
    });
  };

  const createRequest = (values) => {
    networkService.requestApiKey({ email: values.email, name: values.nameOrganization })
      .then((response) => {
        if (response.success) {
          toaster.pop({
            type: 'success',
            body: `To confirm your email address, an email was sent to: ${values.email}  Please follow the instructions in the email to obtain your API key.`,
          });
          formik.resetForm();
        }
      }, (error) => {
        if (error.data.error) {
          toaster.pop({
            type: 'error',
            body: error.data.error,
          });
        } else {
          toaster.pop({
            type: 'error',
            body: error.data.errorMessages[0],
          });
        }
      });
  };

  formik = useFormik({
    initialValues: { email: '', nameOrganization: '' },
    validationSchema,
    onSubmit: (values) => {
      writeAnalytics();
      createRequest(values);
    },
    validateOnChange: false,
    validateOnBlur: true,
  });

  return (
    <Card>
      <CardHeader title="Register" />
      <CardContent>
        <div className={classes.grid}>
          <Typography variant="body1">
            You must register to use this API.
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            id="name-organization"
            name="nameOrganization"
            label="Name or Organization"
            required
            value={formik.values.nameOrganization}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nameOrganization && !!formik.errors.nameOrganization}
            helperText={formik.touched.nameOrganization && formik.errors.nameOrganization}
            InputLabelProps={{ classes: { root: classes.longLabelFix } }}
          />
          <TextField
            fullWidth
            variant="outlined"
            id="email"
            name="email"
            label="Email"
            required
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
            InputLabelProps={{ classes: { root: classes.longLabelFix } }}
          />
        </div>
      </CardContent>
      <CardActions>
        <Button
          fullWidth
          color="primary"
          id="register-button"
          name="registerButton"
          variant="contained"
          onClick={formik.handleSubmit}
          endIcon={<SendIcon />}
        >
          Register
        </Button>
      </CardActions>
    </Card>
  );
}

export default ChplApiKeyRegistration;

ChplApiKeyRegistration.propTypes = { };
