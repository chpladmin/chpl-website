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
import { func } from 'prop-types';
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
  startDay: yup.date()
    .max(new Date(), 'Start Date must not be in the future')
    .required('Start Date is required'),
  endDay: yup.date()
    .max(new Date(), 'End Date must not be in the future')
    .min(yup.ref('startDay'), 'End Date cannot be before the Start Date'),
  type: yup.string()
    .required('Type is required'),
  randomizedSitesUsed: yup.number()
    .when('type', {
      is: 'randomized',
      then: yup.number()
        .required('Sites Used is required'),
    })
    .min(1, 'At least one site must be used'),
});

function ChplSurveillanceEdit({ surveillance, dispatch }) {
  const classes = useStyles();
  let formik;

  const handleDispatch = (action) => {
    switch (action) {
      case 'save':
        formik.handleSubmit();
        break;
      default:
        dispatch({ action });
    }
  };

  const save = () => {
    console.log('formik.values', formik.values);
  };

  formik = useFormik({
    initialValues: {
      startDay: surveillance.startDay ?? '',
      endDay: surveillance.endDay ?? '',
      type: surveillance.type?.name ?? '',
      randomizedSitesUsed: surveillance.randomizedSitesUsed ?? '',
    },
    onSubmit: () => {
      save();
    },
    validationSchema,
  });

  return (
    <>
      <Card>
        <CardHeader title={`${surveillance.id ? 'Edit' : 'Initiate'} Surveillance Activity`} />
        <CardContent>
          <Box display="flex" gridGap="8px" flexWrap="wrap" flexDirection="row" justifyContent="space-between" pb={2}>
            <ChplTextField
              type="date"
              id="start-day"
              name="startDay"
              label="Start Date"
              required
              value={formik.values.startDay}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.startDay && !!formik.errors.startDay}
              helperText={formik.touched.startDay && formik.errors.startDay}
            />
            <ChplTextField
              type="date"
              id="end-day"
              name="endDay"
              label="End Date"
              value={formik.values.endDay}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.endDay && !!formik.errors.endDay}
              helperText={formik.touched.endDay && formik.errors.endDay}
            />
            <ChplTextField
              select
              id="type"
              name="type"
              label="Type"
              required
              value={formik.values.type}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.type && !!formik.errors.type}
              helperText={formik.touched.type && formik.errors.type}
            >
              <MenuItem key="Randomized" value="Randomized">Randomized</MenuItem>
              <MenuItem key="Reactive" value="Reactive">Reactive</MenuItem>
            </ChplTextField>
            <ChplTextField
              type="number"
              id="randomized-sites-used"
              name="randomizedSitesUsed"
              label="Randomized Sites Used"
              required={formik.values.type === 'Randomized'}
              disabled={formik.values.type !== 'Randomized'}
              value={formik.values.randomizedSitesUsed}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.randomizedSitesUsed && !!formik.errors.randomizedSitesUsed}
              helperText={formik.touched.randomizedSitesUsed && formik.errors.randomizedSitesUsed}
            />
          </Box>
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleDispatch}
        canDelete={!!surveillance.id}
      />
    </>
  );
}

export default ChplSurveillanceEdit;

ChplSurveillanceEdit.propTypes = {
  surveillance: surveillancePropType.isRequired,
  dispatch: func.isRequired,
};
