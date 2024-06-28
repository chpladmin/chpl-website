import React, { useEffect, useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Switch,
  makeStyles,
  Typography,
} from '@material-ui/core';
import {
  arrayOf,
  func,
  string,
} from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { user as userPropType } from 'shared/prop-types';

const useStyles = makeStyles({
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
});

const validationSchema = yup.object({
  fullName: yup.string()
    .required('Full Name is required'),
});

function ChplUserEdit({ user: initialUser, errors, dispatch }) {
  const [user, setUser] = useState(undefined);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const save = () => {
    const updatedUser = {
      ...user,
      fullName: formik.values.fullName,
      phoneNumber: formik.values.phoneNumber,
      accountLocked: formik.values.accountLocked,
      accountEnabled: formik.values.accountEnabled,
      passwordResetRequired: formik.values.passwordResetRequired,
    };
    dispatch('save', updatedUser);
  };

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        dispatch('cancel', {});
        break;
      case 'delete':
        dispatch('delete', user.userId);
        break;
      case 'save':
        formik.submitForm();
        break;
        // no default
    }
  };

  formik = useFormik({
    initialValues: {
      fullName: initialUser.fullName,
      phoneNumber: initialUser.phoneNumber || '',
      accountLocked: initialUser.accountLocked,
      accountEnabled: initialUser.accountEnabled,
      passwordResetRequired: initialUser.passwordResetRequired,
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
  });

  if (!user) {
    return (
      <CircularProgress />
    );
  }

  return (
    <>
      <Card>
        <CardHeader
          title="Edit User"
          subheader={user.email}
        />
        <CardContent className={classes.content}>
          <div className={classes.dataEntry}>
            <Typography variant="body1">User Information</Typography>
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
        errors={errors}
        canDelete
        isDisabled={!formik.isValid}
      />
    </>
  );
}

export default ChplUserEdit;

ChplUserEdit.propTypes = {
  user: userPropType.isRequired,
  errors: arrayOf(string),
  dispatch: func,
};

ChplUserEdit.defaultProps = {
  errors: [],
  dispatch: () => {},
};
