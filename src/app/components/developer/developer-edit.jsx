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
    rowGap: '8px',
    columnGap: '16px',
    gridTemplateColumns: '1fr 1fr',
    alignItems: 'start',
  },
}));

const validationSchema = yup.object({
  name: yup.string()
    .required('Name is required')
    .max(300, 'Name is too long'),
  fullName: yup.string()
    .required('Full Name is required')
    .max(3, 'Full Name is too long'),
  title: yup.string()
    .max(3, 'Title is too long'),
  phoneNumber: yup.string()
    .required('Phone is required')
    .max(3, 'Phone is too long'),
  email: yup.string()
    .email('Bad format')
    .required('Email is required')
    .max(3, 'Email is too long'),
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
      name: formik.values.name,
      selfDeveloper: formik.values.selfDeveloper,
      contact: {
        fullName: formik.values.fullName,
        title: formik.values.title,
        phoneNumber: formik.values.phoneNumber,
        email: formik.values.email,
      },
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
      name: developer.name || '',
      selfDeveloper: !!developer.selfDeveloper,
      fullName: developer.contact?.fullName || '',
      title: developer.contact?.title || '',
      phoneNumber: developer.contact?.phoneNumber || '',
      email: developer.contact?.email || '',
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
          title={`Edit ${developer.name}`}
        />
        <CardContent className={classes.content}>
          <ChplTextField
            id="name"
            name="name"
            label="Name"
            required
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && !!formik.errors.name}
            helperText={formik.touched.name && formik.errors.name}
          />
          <FormControlLabel
            control={(
              <Switch
                id="self-developer"
                name="selfDeveloper"
                color="primary"
                checked={formik.values.selfDeveloper}
                onChange={formik.handleChange}
              />
            )}
            label="Self-Developer"
          />
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
            label="Phone"
            required
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />
          <ChplTextField
            id="email"
            name="email"
            label="Email"
            required
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
          />
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
