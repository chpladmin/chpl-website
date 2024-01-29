import React, { useContext } from 'react';
import {
  Card,
  CardContent,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from 'components/util';
import { ListingContext } from 'shared/contexts';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
});

const validationSchema = yup.object({
  sedReportFileLocation: yup.string()
    .url('Improper format (http://www.example.com)')
    .max(250, 'Field is too long'),
  sedIntendedUserDescription: yup.string(),
  sedTestingEndDay: yup.date(),
});

function ChplSedDetailsEdit() {
  const { listing, setListing } = useContext(ListingContext);
  const classes = useStyles();
  let formik;

  const handleBasicChange = (event) => {
    setListing((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    formik.setFieldValue(event.target.name, event.target.value);
  };

  formik = useFormik({
    initialValues: {
      sedReportFileLocation: listing.sedReportFileLocation || '',
      sedIntendedUserDescription: listing.sedIntendedUserDescription || '',
      sedTestingEndDay: listing.sedTestingEndDay || '',
    },
    validationSchema,
  });

  if (!listing) {
    return (
      <CircularProgress />
    );
  }

  return (
    <Card>
      <CardContent className={classes.container}>
        <ChplTextField
          id="sed-report-file-location"
          name="sedReportFileLocation"
          label="Full Usability Report"
          value={formik.values.sedReportFileLocation}
          onChange={handleBasicChange}
          onBlur={formik.handleBlur}
          error={formik.touched.sedReportFileLocation && !!formik.errors.sedReportFileLocation}
          helperText={formik.touched.sedReportFileLocation && formik.errors.sedReportFileLocation}
        />
        <ChplTextField
          id="sed-intended-user-description"
          name="sedIntendedUserDescription"
          label="SED Intended User Description"
          value={formik.values.sedIntendedUserDescription}
          multiline
          onChange={handleBasicChange}
          onBlur={formik.handleBlur}
          error={formik.touched.sedIntendedUserDescription && !!formik.errors.sedIntendedUserDescription}
          helperText={formik.touched.sedIntendedUserDescription && formik.errors.sedIntendedUserDescription}
        />
        <ChplTextField
          id="sed-testing-end-day"
          name="sedTestingEndDay"
          label="SED Testing Completion Date"
          type="date"
          value={formik.values.sedTestingEndDay}
          onChange={handleBasicChange}
          onBlur={formik.handleBlur}
          error={formik.touched.sedTestingEndDay && !!formik.errors.sedTestingEndDay}
          helperText={formik.touched.sedTestingEndDay && formik.errors.sedTestingEndDay}
        />
      </CardContent>
    </Card>
  );
}

export default ChplSedDetailsEdit;

ChplSedDetailsEdit.propTypes = {
};
