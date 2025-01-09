import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  MenuItem,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import ChplRequirementEdit from './requirement-edit';

import { useFetchSurveillanceTypes } from 'api/data';
import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { surveillance as surveillancePropType } from 'shared/prop-types';
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
      is: 'Randomized',
      then: yup.number()
        .required('Sites Used is required'),
    })
    .min(1, 'At least one site must be used'),
});

function ChplSurveillanceEdit({ surveillance, dispatch }) {
  const { data, isLoading, isError } = useFetchSurveillanceTypes();
  const [requirements, setRequirements] = useState([]);
  const [surveillanceTypes, setSurveillanceTypes] = useState([]);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (surveillance.requirements) {
      setRequirements(surveillance.requirements.map((req, idx) => ({
        ...req,
        guid: req.id ?? idx,
      })));
    }
  }, []);

  useEffect(() => {
    if (isLoading || isError) { return; }
    setSurveillanceTypes(data.sort((a, b) => a.name.localeCompare(b.name)));
  }, [data, isLoading, isError]);

  const addReq = () => {
    setRequirements((prev) => prev.concat({ guid: Date.now() }));
  };

  const handleActionBar = (action) => {
    console.log('surv-edit-1', action);
    switch (action) {
      case 'save':
        formik.handleSubmit();
        break;
      default:
        dispatch({ action });
    }
  };

  const handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'remove-req':
        setRequirements((prev) => prev.filter((req) => req.guid !== payload));
        break;
      case 'update-req':
        setRequirements((prev) => prev.map((req) => (req.guid === payload.guid ? payload : req)));
        break;
      default:
        console.log('surv-edit-2', action, payload);
        dispatch({ action, payload });
    }
  };

  const save = () => {
    console.log('formik.values', formik.values);
    console.log('requirements', requirements);
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

  if (surveillanceTypes.length === 0) { return <CircularProgress />; }

  return (
    <>
      <Card>
        <CardHeader title={`${surveillance.id ? 'Edit' : 'Initiate'} Surveillance Activity`} />
        <CardContent>
          <Box display="flex" gridGap="8px" flexWrap="wrap" flexDirection="row" justifyContent="space-between" pb={2}>
            <Typography>
              Surveillance ID:
              {' '}
              { surveillance.friendlyId }
            </Typography>
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
              { surveillanceTypes.map((type) => (
                <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>
              ))}
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
          <Button
            onClick={addReq}
          >
            Add Requirement
          </Button>
          { requirements.map((req) => (
            <ChplRequirementEdit
              key={req.guid}
              requirement={req}
              dispatch={handleDispatch}
              guid={req.guid}
              randomizedSitesUsed={formik.values.randomizedSitesUsed}
            />
          ))}
        </CardContent>
      </Card>
      <ChplActionBar
        dispatch={handleActionBar}
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
