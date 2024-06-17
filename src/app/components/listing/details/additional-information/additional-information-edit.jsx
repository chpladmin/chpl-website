import React, { useContext } from 'react';
import {
  Box,
  CircularProgress,
  makeStyles,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import ChplAccessibilityStandardsEdit from './components/accessibility-standards-edit';
import ChplIcsEdit from './components/ics-edit';
import ChplPromotingInteroperabilityEdit from './components/promoting-interoperability-edit';
import ChplQmsStandardsEdit from './components/qms-standards-edit';
import ChplTargetedUsersEdit from './components/targeted-users-edit';

import { ChplTextField } from 'components/util';
import { ListingContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  column: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: '16px',
    alignItems: 'flex-start',
    width: '100%',
  },
});

const validationSchema = yup.object({
  is2014: yup.boolean(),
  reportFileLocation: yup.string()
    .when('is2014', {
      is: true,
      then: yup.string()
        .required('Field is required'),
    })
    .url('Improper format (http://www.example.com)')
    .max(250, 'Field is too long'),
  otherAcb: yup.string(),
});

function ChplAdditionalInformationEdit() {
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
      is2014: listing.edition?.name === '2014',
      reportFileLocation: listing.reportFileLocation ?? '',
      otherAcb: listing.otherAcb ?? '',
    },
    validationSchema,
  });

  if (!listing) {
    return (
      <CircularProgress />
    );
  }

  return (
    <Box className={classes.column}>
      { (listing.edition?.name === '2014')
        && (
          <ChplTextField
            id="report-file-location"
            name="reportFileLocation"
            label="Report File Location"
            required={formik.values.is2014}
            value={formik.values.reportFileLocation}
            onChange={handleBasicChange}
            onBlur={formik.handleBlur}
            error={formik.touched.reportFileLocation && !!formik.errors.reportFileLocation}
            helperText={formik.touched.reportFileLocation && formik.errors.reportFileLocation}
          />
        )}
      <ChplIcsEdit />
      <ChplTextField
        id="other-acb"
        name="otherAcb"
        label="Other ONC-ACB"
        value={formik.values.otherAcb}
        onChange={handleBasicChange}
        onBlur={formik.handleBlur}
        error={formik.touched.otherAcb && !!formik.errors.otherAcb}
        helperText={formik.touched.otherAcb && formik.errors.otherAcb}
      />
      <ChplTargetedUsersEdit />
      <ChplPromotingInteroperabilityEdit />
      <ChplQmsStandardsEdit />
      <ChplAccessibilityStandardsEdit />
    </Box>
  );
}

export default ChplAdditionalInformationEdit;

ChplAdditionalInformationEdit.propTypes = {
};
