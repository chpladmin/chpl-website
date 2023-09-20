import React, { useContext } from 'react';
import {
  FormControlLabel,
  makeStyles,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from 'components/util';
import { ListingContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

const validationSchema = yup.object({
  acbCertificationId: yup.string(),
});

function ChplListingInformationEdit() {
  const { listing, setListing } = useContext(ListingContext);
  const classes = useStyles();
  let formik;

  const handleChange = (event) => {
    setListing((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
    formik.setFieldValue(event.target.name, event.target.value);
  };

  formik = useFormik({
    initialValues: {
      acbCertificationId: listing.acbCertificationId ?? '',
    },
    validationSchema,
  });

  if (!listing) { return null; }

  return (
    <>
      <ChplTextField
        id="acb-certification-id"
        name="acbCertificationId"
        label="ONC-ACB Certification ID"
        value={formik.values.acbCertificationId}
        onChange={handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.value && !!formik.errors.value}
        helperText={formik.touched.value && formik.errors.value}
      />
    </>
  );
}

export default ChplListingInformationEdit;

ChplListingInformationEdit.propTypes = {
};
