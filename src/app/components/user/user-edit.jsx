import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import {
  arrayOf, func, number, string,
} from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from 'components/util';
import { ChplActionBar, useActionBar } from 'components/action-bar';
import {
  user as userPropType,
} from 'shared/prop-types';

const styles = {
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
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 188px)',
  },
};

const validationSchema = yup.object({
  fullName: yup.string()
    .required('Full Name is required'),
});

function ChplUserEdit({
  user,
  dispatch = () => {},
  errors = [],
  organizationId = undefined,
}) {
  let formik;

  const cancel = () => {
    dispatch('cancel', {});
  };

  const save = () => {
    const updatedUser = {
      ...user,
      fullName: formik.values.fullName,
      organizations: formik.values.accountEnabled ? user.organizations : user.organizations.filter((org) => org.id !== organizationId),
      accountEnabled: formik.values.accountEnabled || user.organizations.length > 1,
    };
    dispatch('save', updatedUser);
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
      fullName: user.fullName,
      phoneNumber: user.phoneNumber || '',
      accountEnabled: user.accountEnabled,
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
  });

  useActionBar({
    errors,
    isDisabled: !formik.isValid,
  });

  return (
    <Box sx={styles.fixFooterSpacing}>
      <Card>
        <CardHeader
          title="Edit User"
          subheader={user.email}
        />
        <CardContent sx={styles.content}>
          <Box sx={styles.dataEntry}>
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
          </Box>
          <Box sx={styles.dataEntry}>
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
          </Box>
        </CardContent>
      </Card>
      <ChplActionBar dispatch={handleDispatch} />
    </Box>
  );
}

export default ChplUserEdit;

ChplUserEdit.propTypes = {
  user: userPropType.isRequired,
  errors: arrayOf(string),
  dispatch: func,
  organizationId: number,
};
