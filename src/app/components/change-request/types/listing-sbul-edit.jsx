import React, { useContext } from 'react';
import {
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
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
});

function ChplChangeRequestListingSbulEdit() {
  const { analytics } = useAnalyticsContext();
  const { changeRequest, setChangeRequest } = useContext(ChangeRequestContext);
  const { hasAnyRole } = useContext(UserContext);
  const classes = useStyles();
  let formik;

  const getCurrent = () => {
    if (changeRequest.details.listing.certificationResults.find((cr) => cr.criterion.id === 182)?.serviceBaseUrlList) {
      const url = changeRequest.details.listing.certificationResults.find((cr) => cr.criterion.id === 182)?.serviceBaseUrlList;
      return (
        <ChplLink
          href={url}
          analytics={{
            ...analytics,
            event: 'Navigate to Current SBUL',
            label: url,
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
      </div>
    </div>
  );
}

export default ChplChangeRequestListingSbulEdit;

ChplChangeRequestListingSbulEdit.propTypes = {
};
