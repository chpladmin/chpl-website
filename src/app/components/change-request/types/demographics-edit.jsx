import React, { useContext } from 'react';
import {
  Divider,
  FormControlLabel,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from 'components/util';
import { ChangeRequestContext, UserContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #DDD',
    paddingRight: '16px',
    marginRight: '8px',
    gap: '16px',
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
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
  website: yup.string()
    .url('Website is not in a valid format')
    .required('Website is required'),
});

function ChplChangeRequestDemographicsEdit() {
  const { changeRequest, setChangeRequest } = useContext(ChangeRequestContext);
  const { hasAnyRole } = useContext(UserContext);
  const classes = useStyles();
  let formik;

  const handleChange = (...args) => {
    const event = args[0];
    setChangeRequest((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [event.target.name]: event.target.value,
        address: {
          ...prev.details.address,
          [event.target.name]: event.target.value,
        },
        contact: {
          ...prev.details.contact,
          [event.target.name]: event.target.value,
        },
      },
    }));
    formik.handleChange(...args);
  };

  formik = useFormik({
    initialValues: {
      email: changeRequest.details.contact.email || '',
      fullName: changeRequest.details.contact.fullName || '',
      phoneNumber: changeRequest.details.contact.phoneNumber || '',
      city: changeRequest.details.address.city || '',
      country: changeRequest.details.address.country || '',
      line1: changeRequest.details.address.line1 || '',
      line2: changeRequest.details.address.line2 || '',
      state: changeRequest.details.address.state || '',
      zipcode: changeRequest.details.address.zipcode || '',
      selfDeveloper: !!changeRequest.details.selfDeveloper,
      website: changeRequest.details.website,
    },
    validationSchema,
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
          <Typography className={classes.fullWidthGridRow}>
            Full Name:
            {' '}
            { changeRequest.developer.contact.fullName }
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
        <Typography>
          Website:
          {' '}
          { changeRequest.developer.website }
        </Typography>
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
              disabled={!hasAnyRole(['chpl-developer'])}
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
            disabled={!hasAnyRole(['chpl-developer'])}
            value={formik.values.fullName}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && !!formik.errors.fullName}
            helperText={formik.touched.fullName && formik.errors.fullName}
            className={classes.fullWidthGridRow}
          />
          <ChplTextField
            id="email"
            name="email"
            label="Email"
            required
            disabled={!hasAnyRole(['chpl-developer'])}
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
            disabled={!hasAnyRole(['chpl-developer'])}
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
            disabled={!hasAnyRole(['chpl-developer'])}
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
            disabled={!hasAnyRole(['chpl-developer'])}
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
            disabled={!hasAnyRole(['chpl-developer'])}
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
            disabled={!hasAnyRole(['chpl-developer'])}
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
            disabled={!hasAnyRole(['chpl-developer'])}
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
            disabled={!hasAnyRole(['chpl-developer'])}
            value={formik.values.country}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.country && !!formik.errors.country}
            helperText={formik.touched.country && formik.errors.country}
          />
        </div>
        <Typography gutterBottom variant="subtitle1">Submitted website</Typography>
        <ChplTextField
          id="website"
          name="website"
          label="Website"
          required
          disabled={!hasAnyRole(['chpl-developer'])}
          value={formik.values.website}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.website && !!formik.errors.website}
          helperText={formik.touched.website && formik.errors.website}
        />
      </div>
    </div>
  );
}

export default ChplChangeRequestDemographicsEdit;

ChplChangeRequestDemographicsEdit.propTypes = {
};
