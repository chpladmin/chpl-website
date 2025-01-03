import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { func, object, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { useAnalyticsContext } from 'shared/contexts';
import { surveillance as surveillancePropType } from 'shared/prop-types';
import { getRequirementDisplay, sortRequirements } from 'services/surveillance.service';
import { palette, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
});

const validationSchema = yup.object({
  requirementType: yup.string()
    .required('Requirement Type is required'),
  requirementTypeOther: yup.string()
    .when('requirementType', {
      is: 'Other',
      then: yup.string()
        .required('Requirement Type - Other is required'),
    }),
  result: yup.string()
    .required('Result is required'),
});

function ChplRequirementEdit({ requirement, dispatch, guid }) {
  const classes = useStyles();
  let formik;

  const handleDispatch = (action) => {
    dispatch({ action });
  };

  formik = useFormik({
    initialValues: {
      type: requirement.requirementType?.title ?? '',
      requirementTypeOther: requirement.requirementTypeOther ?? '',
      result: requirement.result?.name ?? '',
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
  });

  return (
    <>
      <Card>
        <CardHeader title="Requirement" />
        <CardContent>
          <Box display="flex" gridGap="8px" flexWrap="wrap" flexDirection="row" justifyContent="space-between" pb={2}>
            <ChplTextField
              select
              id="requirement-type"
              name="requirementType"
              label="Requirement Type"
              required
              value={formik.values.requirementType}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.requirementType && !!formik.errors.requirementType}
              helperText={formik.touched.requirementType && formik.errors.requirementType}
            >
              <MenuItem key="Randomized" value="Randomized">Randomized</MenuItem>
              <MenuItem key="Reactive" value="Reactive">Reactive</MenuItem>
            </ChplTextField>
            <ChplTextField
              type="text"
              id="requirement-type-other"
              name="requirementTypeOther"
              label="Requirement Type - Other"
              required={formik.values.requirementType === 'Other'}
              disabled={formik.values.requirementType !== 'Other'}
              value={formik.values.requirementTypeOther}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.requirementTypeOther && !!formik.errors.requirementTypeOther}
              helperText={formik.touched.requirementTypeOther && formik.errors.requirementTypeOther}
            />
            <ChplTextField
              select
              id="result"
              name="result"
              label="Result"
              required
              value={formik.values.result}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.result && !!formik.errors.result}
              helperText={formik.touched.result && formik.errors.result}
            >
              <MenuItem key="Randomized" value="Randomized">Randomized</MenuItem>
              <MenuItem key="Reactive" value="Reactive">Reactive</MenuItem>
            </ChplTextField>
          </Box>
        </CardContent>
      </Card>
    </>
  );
}

export default ChplRequirementEdit;

ChplRequirementEdit.propTypes = {
  requirement: object.isRequired,
  dispatch: func.isRequired,
  guid: string.isRequired,
};
