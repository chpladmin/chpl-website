import React from 'react';
import {
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';
import { bool, func } from 'prop-types';

import { contact as contactProp, formik as formikProp } from '../../../shared/prop-types';
import { ChplTextField } from '../../util';

function ChplConfirmDeveloperContact({
  contact, editing, formik, handleChange,
}) {
  return (
    <>
      { (contact || !editing)
        && (
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            Contact
          </Typography>
          <Divider />
        </Grid>
        )}
      <Grid container item>
        { editing
          ? (
            <Grid item xs={6}>
              <ChplTextField
                id="fullName"
                name="fullName"
                label="Name"
                value={formik.values.fullName}
                error={formik.touched.fullName && !!formik.errors.fullName}
                helperText={formik.touched.fullName && formik.errors.fullName}
                onChange={handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
          )
          : (
            <Grid item xs={6}>
              <Typography variant="subtitle2">Name</Typography>
              <Typography variant="body1">{ contact?.fullName }</Typography>
            </Grid>
          )}
        { editing
          ? (
            <Grid item xs={6}>
              <ChplTextField
                id="title"
                name="title"
                label="Title"
                value={formik.values.title}
                onChange={handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
          )
          : (
            <Grid item xs={6}>
              <Typography variant="subtitle2">Title</Typography>
              <Typography variant="body1">{ contact?.title }</Typography>
            </Grid>
          )}
      </Grid>
      <Grid container item>
        { editing
          ? (
            <Grid item xs={6}>
              <ChplTextField
                id="email"
                name="email"
                label="Email"
                value={formik.values.email}
                error={formik.touched.email && !!formik.errors.email}
                helperText={formik.touched.email && formik.errors.email}
                onChange={handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
          )
          : (
            <Grid item xs={6}>
              <Typography variant="subtitle2">Email</Typography>
              <Typography variant="body1">{ contact?.email }</Typography>
            </Grid>
          )}
        { editing
          ? (
            <Grid item xs={6}>
              <ChplTextField
                id="phoneNumber"
                name="phoneNumber"
                label="Phone"
                value={formik.values.phoneNumber}
                error={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
                helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                onChange={handleChange}
                onBlur={formik.handleBlur}
              />
            </Grid>
          )
          : (
            <Grid item xs={6}>
              <Typography variant="subtitle2">Phone</Typography>
              <Typography variant="body1">{ contact?.phoneNumber }</Typography>
            </Grid>
          )}
      </Grid>
    </>
  );
}

export default ChplConfirmDeveloperContact;

ChplConfirmDeveloperContact.propTypes = {
  contact: contactProp.isRequired,
  editing: bool.isRequired,
  formik: formikProp.isRequired,
  handleChange: func,
};

ChplConfirmDeveloperContact.defaultProps = {
  handleChange: () => {},
};
