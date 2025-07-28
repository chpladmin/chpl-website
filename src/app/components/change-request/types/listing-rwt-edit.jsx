import React, { useContext, useEffect } from 'react';
import {
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { bool, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplLink, ChplTextField } from 'components/util';
import { ChangeRequestContext, UserContext, useAnalyticsContext } from 'shared/contexts';

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

function ChplChangeRequestListingRwtEdit({ isAccepting, title, value }) {
  const { analytics } = useAnalyticsContext();
  const { changeRequest, setChangeRequest } = useContext(ChangeRequestContext);
  const { hasAnyRole } = useContext(UserContext);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    formik.setFieldValue('mustHaveDate', hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && isAccepting);
  }, [hasAnyRole, isAccepting]);

  const getCurrent = () => {
    if (changeRequest.details.listing[value]) {
      return (
        <ChplLink
          href={changeRequest.details.listing[value]}
          analytics={{
            ...analytics,
            event: `Navigate to Current RWT ${title} URL`,
            label: changeRequest.details.listing[value],
          }}
        />
      );
    }
    return 'No current URL';
  };

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
      checkDate: changeRequest.details.checkDate || '',
      mustHaveDate: hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && isAccepting,
    },
    validationSchema,
  });

  return (
    <div className={classes.container}>
      <div className={classes.detailsContainer}>
        <Typography variant="subtitle1">Current details</Typography>
        <Typography>
          { getCurrent() }
        </Typography>
        <Typography>
          <ChplLink
            href={`#/listing/${changeRequest.details.listing.id}`}
            text={changeRequest.details.listing.chplProductNumber}
            analytics={{
              ...analytics,
              event: 'Navigate to Listing Details Page',
              label: changeRequest.details.listing.chplProductNumber,
              aggregationName: changeRequest.details.listing.product.name,
            }}
            external={false}
            router={{ sref: 'listing', options: { id: changeRequest.details.listing.id } }}
          />
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
              required={isAccepting}
              disabled={!isAccepting}
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

export default ChplChangeRequestListingRwtEdit;

ChplChangeRequestListingRwtEdit.propTypes = {
  isAccepting: bool,
  title: string.isRequired,
  value: string.isRequired,
};

ChplChangeRequestListingRwtEdit.defaultProps = {
  isAccepting: false,
};
