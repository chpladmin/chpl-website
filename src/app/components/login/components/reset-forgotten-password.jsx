import React, { useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  makeStyles,
} from '@material-ui/core';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { func, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import PasswordStrengthMeter from './password-strength-meter';

import { usePostSetForgottenPassword } from 'api/auth';
import { ChplTextField } from 'components/util';

const zxcvbn = require('zxcvbn');

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
});

function ChplResetForgottenPassword({ dispatch, uuid }) {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostSetForgottenPassword();
  const [passwordMessages, setPasswordMessages] = useState([]);
  const [strength, setStrength] = useState(0);
  const classes = useStyles();

  let formik;

  const catchEnter = (e, target) => {
    if (e.key === 'Enter') {
      target(e);
    }
  };

  const resetForgottenPassword = () => {
    mutate({
      forgotPasswordToken: uuid,
      password: formik.values.newPassword,
    }, {
      onSuccess: () => {
        const body = 'Your password has been successfully reset';
        enqueueSnackbar(body, { variant: 'success' });
        dispatch({ action: 'loggedOut' });
      },
      onError: (error) => {
        console.error(error);
        const body = 'Error. Please check your credentials or contact the administrator';
        enqueueSnackbar(body, { variant: 'error' });
      },
    });
  };

  const submitChange = (e) => {
    e.stopPropagation();
    formik.handleSubmit();
  };

  const updateChangePassword = (event) => {
    const vals = ['chpl'];
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
    validationSchema,
    initialValues: {
      newPassword: '',
      verificationPassword: '',
      passwordStrength: 0,
    },
    onSubmit: () => {
      resetForgottenPassword();
    },
  });

  return (
    <Card>
      <CardHeader className={classes.loginHeader} title="Reset forgotten password" />
      <CardContent className={classes.grid}>
        <ChplTextField
          type="password"
          id="new-password"
          name="newPassword"
          label="New Password"
          required
          value={formik.values.newPassword}
          onChange={updateChangePassword}
          onBlur={formik.handleBlur}
          onKeyPress={(e) => catchEnter(e, submitChange)}
          error={formik.touched.newPassword && !!formik.errors.newPassword}
          helperText={formik.touched.newPassword && formik.errors.newPassword}
        />
        {' '}
        <PasswordStrengthMeter
          value={strength}
        />
        {passwordMessages.length > 0
         && (
           <ul>
             {passwordMessages.map((msg) => (
               <li key={msg}>{msg}</li>
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
          onKeyPress={(e) => catchEnter(e, submitChange)}
          error={formik.touched.verificationPassword && !!formik.errors.verificationPassword}
          helperText={formik.touched.verificationPassword && formik.errors.verificationPassword}
        />
        <Button
          fullWidth
          color="primary"
          variant="contained"
          onClick={submitChange}
          endIcon={<VpnKeyIcon />}
        >
          Confirm new Password
        </Button>
      </CardContent>
    </Card>
  );
}

export default ChplResetForgottenPassword;

ChplResetForgottenPassword.propTypes = {
  dispatch: func.isRequired,
  uuid: string.isRequired,
};
