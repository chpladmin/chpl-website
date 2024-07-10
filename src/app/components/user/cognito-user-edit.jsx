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

import theme from '../../themes/theme';
import { ChplTextField } from '../util';
import { ChplActionBar } from '../action-bar';
import {
  user as userPropType,
} from '../../shared/prop-types';

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

function ChplCognitoUserEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [user] = useState(props.user);
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  let formik;

  const cancel = () => {
    props.dispatch('cancel', {});
  };

  const deleteUser = () => {
    props.dispatch('delete', user.userId);
  };

  const save = () => {
    const updatedUser = {
      ...user,
      fullName: formik.values.fullName,
      friendlyName: formik.values.friendlyName,
      title: formik.values.title,
      phoneNumber: formik.values.phoneNumber,
      accountLocked: formik.values.accountLocked,
      accountEnabled: formik.values.accountEnabled,
      passwordResetRequired: formik.values.passwordResetRequired,
    };
    props.dispatch('save', updatedUser);
  };

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        cancel();
        break;
      case 'delete':
        deleteUser();
        break;
      case 'save':
        formik.submitForm();
        break;
        // no default
    }
  };

  formik = useFormik({
    initialValues: {
      fullName: user.fullName,
      friendlyName: user.friendlyName || '',
      title: user.title || '',
      phoneNumber: user.phoneNumber || '',
      accountLocked: user.accountLocked,
      accountEnabled: user.accountEnabled,
      passwordResetRequired: user.passwordResetRequired,
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
    validateOnChange: false,
    validateOnMount: true,
  });

  return (
    <ThemeProvider theme={theme}>
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
          </div>
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleDispatch}
        errors={props.errors}
        canDelete
        isDisabled={!formik.isValid}
      />
    </ThemeProvider>
  );
}

export default ChplCognitoUserEdit;

ChplCognitoUserEdit.propTypes = {
  user: userPropType.isRequired,
  errors: arrayOf(string),
  dispatch: func,
};

ChplCognitoUserEdit.defaultProps = {
  errors: [],
  dispatch: () => {},
};
