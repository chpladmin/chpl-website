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
import { resources as resourcesPropType, listing as listingPropType } from 'shared/prop-types';

const validationSchema = yup.object({
  value: yup.string()
    .required('Field is required'),
  regulatoryTextCitation: yup.string(),
  rule: yup.string(),
  endDay: yup.date(),
  requiredDay: yup.date(),
  startDay: yup.date(),
});

const useStyles = makeStyles({
});

function ChplListingEdit({
    listing,
    onChange,
    resources,
    showFormErrors,
    workType,
  }) {
  const classes = useStyles();
  let formik;

  const buildPayload = () => ({
    ...testTool,
    value: formik.values.value,
    regulatoryTextCitation: formik.values.regulatoryTextCitation,
    rule: rules.find((rule) => rule.name === formik.values.rule),
    criteria,
    endDay: formik.values.endDay,
    requiredDay: formik.values.requiredDay,
    startDay: formik.values.startDay,
  });

  const handleDispatch = (action) => {
    switch (action) {
        // no default
    }
  };

  formik = useFormik({
    initialValues: {
      value: initialTestTool?.value ?? '',
      regulatoryTextCitation: initialTestTool?.regulatoryTextCitation ?? '',
      rule: initialTestTool?.rule?.name ?? '',
      endDay: initialTestTool?.endDay ?? '',
      requiredDay: initialTestTool?.requiredDay ?? '',
      startDay: initialTestTool?.startDay ?? '',
    },
    onSubmit: () => {
      dispatch({ action: 'save', payload: buildPayload() });
    },
    validationSchema,
  });

  if (!listing) { return null; }

  return (
    <>
      Listing edit
      <ChplTextField
        id="value"
        name="value"
        label="Value"
        value={formik.values.value}
        required
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
  listing: listingPropType.isRequired,
  onChange: func.isRequired,
  resources: resourcesPropType.isRequired,
  showFormErrors: bool.isRequired,
  workType: string.isRequired,
};
