import React, { useState } from 'react';
import {
  arrayOf,
  func,
  string,
} from 'prop-types';
import {
  Card,
  CardHeader,
  CardContent,
  FormControlLabel,
  Switch,
  ThemeProvider,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { developer as developerPropType } from 'shared/prop-types';

const useStyles = makeStyles(() => ({
  content: {
    display: 'grid',
    gap: '16px',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'start',
  },
  dataEntry: {
    display: 'grid',
    gap: '8px',
  },
}));

const validationSchema = yup.object({
  fullName: yup.string()
    .required('Full Name is required'),
});

function ChplDeveloperEdit(props) {
  const { developer, dispatch } = props;
  const classes = useStyles();
  let formik;

  const cancel = () => {
    dispatch('cancel');
  };

  const save = () => {
    const updatedDeveloper = {
      ...developer,
      fullName: formik.values.fullName,
      friendlyName: formik.values.friendlyName,
      title: formik.values.title,
      phoneNumber: formik.values.phoneNumber,
      accountLocked: formik.values.accountLocked,
      accountEnabled: formik.values.accountEnabled,
      passwordResetRequired: formik.values.passwordResetRequired,
    };
    dispatch('save', updatedDeveloper);
  };

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        cancel();
        break;
      case 'save':
        formik.submitForm();
        break;
        // no default
    }
  };

  formik = useFormik({
    initialValues: {
      fullName: developer.fullName,
      friendlyName: developer.friendlyName || '',
      title: developer.title || '',
      phoneNumber: developer.phoneNumber || '',
      accountLocked: developer.accountLocked,
      accountEnabled: developer.accountEnabled,
      passwordResetRequired: developer.passwordResetRequired,
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
  });

  return (
    <>
      <Card>
        <CardHeader
          title="Edit Developer"
          subheader={developer.email}
        />
        <CardContent className={classes.content}>
          <div className={classes.dataEntry}>
            <Typography variant="body1">Developer Information</Typography>
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
          </div>
          <div className={classes.dataEntry}>
            <Typography variant="body1">Settings</Typography>
            <div>
              <FormControlLabel
                control={(
                  <Switch
                    id="account-locked"
                    name="accountLocked"
                    color="primary"
                    checked={formik.values.accountLocked}
                    onChange={formik.handleChange}
                  />
                  )}
                label="Account Locked"
              />
            </div>
            <div>
              <FormControlLabel
                control={(
                  <Switch
                    id="account-enabled"
                    name="accountEnabled"
                    color="primary"
                    checked={formik.values.accountEnabled}
                    onChange={formik.handleChange}
                  />
                  )}
                label="Account Enabled"
              />
            </div>
            <div>
              <FormControlLabel
                control={(
                  <Switch
                    id="password-reset-required"
                    name="passwordResetRequired"
                    color="primary"
                    checked={formik.values.passwordResetRequired}
                    onChange={formik.handleChange}
                  />
                  )}
                label="Password change on next login"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleDispatch}
        isDisabled={!formik.isValid}
      />
    </>
  );
}

export default ChplDeveloperEdit;

ChplDeveloperEdit.propTypes = {
  developer: developerPropType.isRequired,
  dispatch: func.isRequired,
};
