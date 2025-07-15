import React, { useContext } from 'react';
import {
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
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
  checkDate: yup.date()
    .when('mustHaveDate', {
      is: (mustHaveDate) => mustHaveDate,
      then: yup.date().required('Check Date is required'),
      otherwise: yup.date(),
    }),
});

function ChplChangeRequestListingRwtPlansEdit() {
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
      },
    }));
    formik.handleChange(...args);
  };

  formik = useFormik({
    initialValues: {
      url: changeRequest.details.url || '',
      checkDate: changeRequest.details.checkDate || jsJoda.LocalDate.now(),
      mustHaveDate: hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']),
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
          disabled={!hasAnyRole(['chpl-developer'])}
          value={formik.values.url}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.url && !!formik.errors.url}
          helperText={formik.touched.url && formik.errors.url}
        />
        { hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb'])
          && (
            <ChplTextField
              id="check-date"
              name="checkDate"
              label="Check Date"
              type="date"
              required
              value={formik.values.checkDate}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.checkDate && !!formik.errors.checkDate}
              helperText={formik.touched.checkDate && formik.errors.checkDate}
            />
          )}
      </div>
    </div>
  );
}

export default ChplChangeRequestListingRwtPlansEdit;

ChplChangeRequestListingRwtPlansEdit.propTypes = {
};
