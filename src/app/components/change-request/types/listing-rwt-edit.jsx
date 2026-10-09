import React, { useContext, useEffect } from 'react';
import { Box, Divider, Typography } from '@mui/material';
import { bool } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import ChplUrlChecker from 'components/url-checker/url-checker';
import { ChplLink, ChplTextField } from 'components/util';
import {
  ChangeRequestContext, UserContext, useAnalyticsContext, useFormGroupMember,
} from 'shared/contexts';

const styles = {
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
    gap: '8px',
    flexDirection: 'column',
  },
  detailsSubContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
};

const validationSchema = yup.object({
  checkDate: yup.date()
    .when('mustHaveDate', {
      is: (mustHaveDate) => mustHaveDate,
      then: yup.date().required('Check Date is required'),
      otherwise: yup.date(),
    }),
});

function ChplChangeRequestListingRwtEdit({ isAccepting = false }) {
  const { analytics } = useAnalyticsContext();
  const { changeRequest, setChangeRequest } = useContext(ChangeRequestContext);
  const { hasAnyRole } = useContext(UserContext);
  let formik;

  useEffect(() => {
    formik.setFieldValue('mustHaveDate', hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && isAccepting);
  }, [hasAnyRole, isAccepting]);

  const getCurrent = () => {
    if (changeRequest.details.listing.rwtResultsUrl) {
      return (
        <ChplLink
          href={changeRequest.details.listing.rwtResultsUrl}
          analytics={{
            ...analytics,
            event: 'Navigate to Current RWT Results URL',
            label: changeRequest.details.listing.rwtResultsUrl,
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

  const handleDispatch = ({ url: submittedUrl }) => {
    setChangeRequest((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        url: submittedUrl,
      },
    }));
  };

  formik = useFormik({
    initialValues: {
      checkDate: changeRequest.details.checkDate || '',
      mustHaveDate: hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb']) && isAccepting,
    },
    validationSchema,
  });

  useFormGroupMember(formik);

  return (
    <Box sx={styles.container}>
      <Box sx={styles.detailsContainer}>
        <Typography variant="subtitle1">Current details</Typography>
        <Typography>
          { getCurrent() }
        </Typography>
      </Box>
      <Divider />
      <Box sx={styles.detailsContainer}>
        <Typography variant="subtitle1">Submitted details</Typography>
        { hasAnyRole(['chpl-developer'])
          && (
            <ChplUrlChecker
              dispatch={handleDispatch}
              url={changeRequest.details.url}
            />
          )}
        { !hasAnyRole(['chpl-developer'])
          && (
            <ChplTextField
              id="url"
              name="url"
              label="url"
              disabled
              value={changeRequest.details.url}
            />
          )}
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
      </Box>
    </Box>
  );
}

export default ChplChangeRequestListingRwtEdit;

ChplChangeRequestListingRwtEdit.propTypes = {
  isAccepting: bool,
};
