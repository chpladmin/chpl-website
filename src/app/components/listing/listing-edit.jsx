import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import { bool, func, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { isCures, sortCriteria } from 'services/criteria.service';
import { ListingContext } from 'shared/contexts';
import { resources as resourcesPropType, listing as listingPropType } from 'shared/prop-types';

const validationSchema = yup.object({
  acbCertificationId: yup.string(),
});

const useStyles = makeStyles({
});

function ChplListingEdit({
    onChange,
    resources,
    showFormErrors,
    workType,
  }) {
  const { listing, setListing } = useContext(ListingContext);
  const classes = useStyles();
  let formik;

  const updateListing = () => ({
    ...listing,
    acbCertificationId: formik.values.acbCertificationId,
  });

  formik = useFormik({
    initialValues: {
      acbCertificationId: listing.acbCertificationId ?? '',
    },
    onSubmit: () => {
      const updated = updateListing();
      console.log(updated.acbCertificationId);
      //onChange(updated, {}, reason);
    },
    validationSchema,
  });

  if (!listing) { return null; }

  return (
    <>
      Listing edit
      <ChplTextField
        id="acb-certification-id"
        name="acbCertificationId"
        label="ONC-ACB Certification ID"
        value={formik.values.acbCertificationId}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.value && !!formik.errors.value}
        helperText={formik.touched.value && formik.errors.value}
      />
    </>
  );
}

export default ChplListingEdit;

ChplListingEdit.propTypes = {
  onChange: func.isRequired,
  resources: resourcesPropType.isRequired,
  showFormErrors: bool.isRequired,
  workType: string.isRequired,
};
