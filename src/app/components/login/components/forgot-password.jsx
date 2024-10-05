import React from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  makeStyles,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import SendIcon from '@material-ui/icons/Send';
import { func, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import { usePostForgotPassword } from 'api/auth';
import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';
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

const validationSchema = yup.object({
  email: yup.string()
    .required('Email is required')
    .email('Email format is invalid'),
});

function ChplForgotPassword({ dispatch, userName }) {
  const { analytics } = useAnalyticsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostForgotPassword();

  const classes = useStyles();

  let formik;

  const cancel = (e) => {
    eventTrack({
      ...analytics,
      event: 'Cancel Forgot Password',
      category: 'Authentication',
    });
    e.stopPropagation();
    dispatch({ action: 'loggedOut' });
  };

  const catchEnter = (e, target) => {
    if (e.key === 'Enter') {
      target(e);
    }
  };

  const sendForgottenPasswordEmail = () => {
    mutate({ userName: formik.values.email }, {
      onSuccess: () => {
        eventTrack({
          ...analytics,
          event: 'Send Reset Email',
          category: 'Authentication',
        });
        const body = `Forgotten password email sent to ${formik.values.email}; please check your email`;
        enqueueSnackbar(body, { variant: 'success' });
        dispatch({ action: 'loggedOut' });
        formik.resetForm();
      },
      onError: () => {
        const body = `Email could not be sent to ${formik.values.email}`;
        enqueueSnackbar(body, { variant: 'error' });
      },
    });
  };

  const submitForgottenPasswordRequest = (e) => {
    e.stopPropagation();
    formik.handleSubmit();
  };

  formik = useFormik({
    validationSchema,
    initialValues: {
      email: userName,
    },
    onSubmit: () => {
      sendForgottenPasswordEmail();
    },
  });

  return (
    <Card>
      <CardHeader className={classes.loginHeader} title="Forgotten password" />
      <CardContent className={classes.grid}>
        <ChplTextField
          id="email"
          name="email"
          label="Email"
          required
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onKeyPress={(e) => catchEnter(e, submitForgottenPasswordRequest)}
          error={formik.touched.email && !!formik.errors.email}
          helperText={formik.touched.email && formik.errors.email}
        />
        <Button
          fullWidth
          color="primary"
          variant="contained"
          onClick={submitForgottenPasswordRequest}
          endIcon={<SendIcon />}
        >
          Send forgotten password email
        </Button>
        <Button
          fullWidth
          color="default"
          variant="contained"
          onClick={cancel}
          endIcon={<ClearIcon />}
        >
          Cancel
        </Button>
      </CardContent>
    </Card>
  );
}

export default ChplForgotPassword;

ChplForgotPassword.propTypes = {
  dispatch: func.isRequired,
  userName: string.isRequired,
};
