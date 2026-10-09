import React from 'react';
import {
  Box, Button, Card, CardActions, CardContent, CardHeader, TextField, Typography,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { usePostRequestApiKey } from 'api/api-keys';
import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';
import { palette } from 'themes';

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridRowGap: '16px',
  },
  textField: {
    '& .MuiInputLabel-root': {
      paddingRight: '4px',
      backgroundColor: palette.white,
    },
  },
};

const validationSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Enter a valid email'),
  nameOrganization: yup.string()
    .required('Name or Organization is required'),
});

function ChplApiKeyRegistration() {
  const { mutate } = usePostRequestApiKey();
  const { enqueueSnackbar } = useSnackbar();
  const { analytics } = useAnalyticsContext();
  let formik = {};

  const writeAnalytics = () => {
    eventTrack({
      ...analytics,
      event: 'Register for API Key',
    });
  };

  const createRequest = (values) => {
    mutate({ email: values.email, name: values.nameOrganization }, {
      onSuccess: (response) => {
        if (response.success) {
          enqueueSnackbar(`To confirm your email address, an email was sent to: ${values.email}  Please follow the instructions in the email to obtain your API key.`, {
            variant: 'success',
          });
          formik.resetForm();
        }
      },
      onError: (error) => {
        if (error.data.error) {
          enqueueSnackbar(error.data.error, {
            variant: 'error',
          });
        } else {
          enqueueSnackbar(error.data.errorMessages[0], {
            variant: 'error',
          });
        }
      },
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
        <Box sx={styles.grid}>
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
            sx={styles.textField}
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
            sx={styles.textField}
          />
        </Box>
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
