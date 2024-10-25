import React, { useContext, useState } from 'react';
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  makeStyles,
} from '@material-ui/core';
import ClearIcon from '@material-ui/icons/Clear';
import VpnKeyIcon from '@material-ui/icons/VpnKey';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useSnackbar } from 'notistack';

import PasswordStrengthMeter from './password-strength-meter';

import { usePostCognitoChangePassword } from 'api/auth';
import { eventTrack } from 'services/analytics.service';
import { UserContext, useAnalyticsContext } from 'shared/contexts';
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
  password: yup.string()
    .required('Password is required')
    .test(
      'password-strength',
      'Password is not strong enough',
      (value, context) => context.parent.passwordStrength >= 3,
    ),
  confirmPassword: yup.string()
    .required('Verify Password is required')
    .test(
      'password-matches',
      'Verify Password does not match Password',
      (value, context) => value === context.parent.password,
    ),
});

function ChplChangePassword({ dispatch }) {
  const { user } = useContext(UserContext);
  const { analytics } = useAnalyticsContext();
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostCognitoChangePassword();
  const [passwordMessages, setPasswordMessages] = useState([]);
  const [strength, setStrength] = useState(0);
  const classes = useStyles();

  let formik;

  const catchEnter = (e, target) => {
    if (e.key === 'Enter') {
      target(e);
    }
  };

  const cancel = () => {
    eventTrack({
      ...analytics,
      event: 'Cancel Password Change',
      category: 'Authentication',
    });
    dispatch({ action: 'cancel' });
  };

  const changePassword = () => {
    mutate({
      password: formik.values.password,
      confirmPassword: formik.values.confirmPassword,
    }, {
      onSuccess: () => {
        eventTrack({
          ...analytics,
          event: 'Confirm New Password',
          category: 'Authentication',
        });
        const body = 'Password successfully changed';
        enqueueSnackbar(body, { variant: 'success' });
        dispatch({ action: 'cancel' });
      },
      onError: () => {
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
    if (user?.fullName) { vals.push(user.fullName); }
    if (user?.email) { vals.push(user.email); }
    if (user?.phoneNumber) { vals.push(user.phoneNumber); }
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
      password: '',
      confirmPassword: '',
      passwordStrength: 0,
    },
    onSubmit: () => {
      changePassword();
    },
  });

  return (
    <Card>
      <CardHeader className={classes.loginHeader} title="Change password" />
      <CardContent className={classes.grid}>
        <ChplTextField
          type="password"
          id="password"
          name="password"
          label="New Password"
          required
          value={formik.values.password}
          onChange={updateChangePassword}
          onBlur={formik.handleBlur}
          onKeyPress={(e) => catchEnter(e, submitChange)}
          error={formik.touched.password && !!formik.errors.password}
          helperText={formik.touched.password && formik.errors.password}
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
          name="confirmPassword"
          label="Verify Password"
          required
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onKeyPress={(e) => catchEnter(e, submitChange)}
          error={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
          helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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

export default ChplChangePassword;

ChplChangePassword.propTypes = {
  dispatch: func.isRequired,
};
