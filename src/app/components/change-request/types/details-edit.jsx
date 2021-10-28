import React, { useContext } from 'react';
import {
  Divider,
  FormControlLabel,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from '../../util';
import { changeRequest as changeRequestProp } from '../../../shared/prop-types';
import { UserContext } from '../../../shared/contexts';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
  },
  detailsContainer: {
    display: 'grid',
    gap: '8px',
  },
  detailsSubContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
});

const validationSchema = yup.object({
  email: yup.string()
    .email('Email is not a valid format')
    .required('Email is required'),
  fullName: yup.string()
    .required('Full name is required'),
  phoneNumber: yup.string()
    .required('Phone is required'),
  title: yup.string(),
  city: yup.string()
    .required('City is required'),
  country: yup.string()
    .required('Country is required'),
  line1: yup.string()
    .required('Address is required'),
  line2: yup.string(),
  state: yup.string()
    .required('State is required'),
  zipcode: yup.string()
    .required('Zip is required'),
});

function ChplChangeRequestDetailsEdit(props) {
  const { hasAnyRole } = useContext(UserContext);
  const { changeRequest } = props;
  const classes = useStyles();
  let formik;

  const handleChange = (...args) => {
    formik.handleChange(...args);
    if (formik.isValid) {
      formik.submitForm();
    }
  };

  formik = useFormik({
    initialValues: {
      email: changeRequest.details.contact.email || '',
      fullName: changeRequest.details.contact.fullName || '',
      phoneNumber: changeRequest.details.contact.phoneNumber || '',
      title: changeRequest.details.contact.title || '',
      city: changeRequest.details.address.city || '',
      country: changeRequest.details.address.country || '',
      line1: changeRequest.details.address.line1 || '',
      line2: changeRequest.details.address.line2 || '',
      state: changeRequest.details.address.state || '',
      zipcode: changeRequest.details.address.zipcode || '',
      selfDeveloper: !!changeRequest.details.selfDeveloper,
    },
    onSubmit: () => {
      props.dispatch('update', formik.values);
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  });

  return (
    <div className={classes.container}>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">Current details</Typography>
        <Typography>
          Self-Developer:
          {' '}
          { changeRequest.developer.selfDeveloper ? 'Yes' : 'No' }
        </Typography>
        <Typography variant="subtitle2">Contact</Typography>
        <div className={classes.detailsSubContainer}>
          <Typography>
            Full Name:
            {' '}
            { changeRequest.developer.contact.fullName }
          </Typography>
          <Typography>
            Title:
            {' '}
            { changeRequest.developer.contact.title }
          </Typography>
          <Typography>
            Email:
            {' '}
            { changeRequest.developer.contact.email }
          </Typography>
          <Typography>
            Phone:
            {' '}
            { changeRequest.developer.contact.phoneNumber }
          </Typography>
        </div>
        <Typography variant="subtitle2">Address</Typography>
        <div className={classes.detailsSubContainer}>
          <Typography>
            Address:
            {' '}
            { changeRequest.developer.address.line1 }
          </Typography>
          <Typography>
            Line 2:
            {' '}
            { changeRequest.developer.address.line2 }
          </Typography>
          <Typography>
            City:
            {' '}
            { changeRequest.developer.address.city }
          </Typography>
          <Typography>
            State:
            {' '}
            { changeRequest.developer.address.state }
          </Typography>
          <Typography>
            Zip:
            {' '}
            { changeRequest.developer.address.zipcode }
          </Typography>
          <Typography>
            Country:
            {' '}
            { changeRequest.developer.address.country }
          </Typography>
        </div>
      </div>
      <Divider />
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">Submitted details</Typography>
        <FormControlLabel
          control={(
            <Switch
              id="self-developer"
              name="selfDeveloper"
              color="primary"
              disabled={!hasAnyRole(['ROLE_DEVELOPER'])}
              checked={formik.values.selfDeveloper}
              onChange={handleChange}
            />
          )}
          label="Self-Developer"
        />
        <Typography variant="subtitle2">Contact</Typography>
        <div className={classes.detailsSubContainer}>
          <ChplTextField
            id="full-name"
            name="fullName"
            label="Full Name"
            required
            disabled={!hasAnyRole(['ROLE_DEVELOPER'])}
            value={formik.values.fullName}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && !!formik.errors.fullName}
            helperText={formik.touched.fullName && formik.errors.fullName}
          />
          <ChplTextField
            id="title"
            name="title"
            label="Title"
            disabled={!hasAnyRole(['ROLE_DEVELOPER'])}
            value={formik.values.title}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && !!formik.errors.title}
            helperText={formik.touched.title && formik.errors.title}
          />
          <ChplTextField
            id="email"
            name="email"
            label="Email"
            required
            disabled={!hasAnyRole(['ROLE_DEVELOPER'])}
            value={formik.values.email}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
          />
          <ChplTextField
            id="phone-number"
            name="phoneNumber"
            label="Phone"
            required
            disabled={!hasAnyRole(['ROLE_DEVELOPER'])}
            value={formik.values.phoneNumber}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />
        </div>
        <Typography variant="subtitle2">Address</Typography>
        <div className={classes.detailsSubContainer}>
          <ChplTextField
            id="line1"
            name="line1"
            label="Address"
            required
            disabled={!hasAnyRole(['ROLE_DEVELOPER'])}
            value={formik.values.line1}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.line1 && !!formik.errors.line1}
            helperText={formik.touched.line1 && formik.errors.line1}
          />
          <ChplTextField
            id="line2"
            name="line2"
            label="Line 2"
            disabled={!hasAnyRole(['ROLE_DEVELOPER'])}
            value={formik.values.line2}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.line2 && !!formik.errors.line2}
            helperText={formik.touched.line2 && formik.errors.line2}
          />
          <ChplTextField
            id="city"
            name="city"
            label="City"
            required
            disabled={!hasAnyRole(['ROLE_DEVELOPER'])}
            value={formik.values.city}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.city && !!formik.errors.city}
            helperText={formik.touched.city && formik.errors.city}
          />
          <ChplTextField
            id="state"
            name="state"
            label="State"
            required
            disabled={!hasAnyRole(['ROLE_DEVELOPER'])}
            value={formik.values.state}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.state && !!formik.errors.state}
            helperText={formik.touched.state && formik.errors.state}
          />
          <ChplTextField
            id="zipcode"
            name="zipcode"
            label="Zip"
            required
            disabled={!hasAnyRole(['ROLE_DEVELOPER'])}
            value={formik.values.zipcode}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.zipcode && !!formik.errors.zipcode}
            helperText={formik.touched.zipcode && formik.errors.zipcode}
          />
          <ChplTextField
            id="country"
            name="country"
            label="Country"
            required
            disabled={!hasAnyRole(['ROLE_DEVELOPER'])}
            value={formik.values.country}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.country && !!formik.errors.country}
            helperText={formik.touched.country && formik.errors.country}
          />
        </div>
      </div>
    </div>
  );
}

export default ChplChangeRequestDetailsEdit;

ChplChangeRequestDetailsEdit.propTypes = {
  changeRequest: changeRequestProp.isRequired,
  dispatch: func.isRequired,
};
