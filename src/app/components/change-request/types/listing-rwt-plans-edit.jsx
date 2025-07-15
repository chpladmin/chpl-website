import React, { useContext, useEffect } from 'react';
import {
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from 'components/util';
import { jsJoda } from 'services/date-util';
import { ChangeRequestContext, UserContext } from 'shared/contexts';

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
  url: yup.string()
    .url('URL is not in a valid format')
    .required('URL is required'),
});

function ChplChangeRequestListingRwtPlansEdit({ dispatch }) {
  const { changeRequest, setChangeRequest } = useContext(ChangeRequestContext);
  const { hasAnyRole } = useContext(UserContext);
  const classes = useStyles();
  let formik;

  const handleChange = (...args) => {
    formik.handleChange(...args);
    dispatch('update', formik.values);
  };

  formik = useFormik({
    initialValues: {
      url: changeRequest.details.url || '',
    },
    validationSchema,
  });

  return (
    <div className={classes.container}>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">Current details</Typography>
        <Typography>
          { changeRequest.details.listing.rwtPlansUrl }
        </Typography>
        <Typography>
          { changeRequest.details.listing.chplProductNumber }
        </Typography>
      </div>
      <Divider />
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">Submitted details</Typography>
        <ChplTextField
          id="url"
          name="url"
          label="url"
          required
          disabled
          value={formik.values.url}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.url && !!formik.errors.url}
          helperText={formik.touched.url && formik.errors.url}
        />
      </div>
    </div>
  );
}

export default ChplChangeRequestListingRwtPlansEdit;

ChplChangeRequestListingRwtPlansEdit.propTypes = {
  dispatch: func.isRequired,
};
