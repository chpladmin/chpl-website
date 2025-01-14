import React, { useContext, useEffect, useState } from 'react';
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
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as yup from 'yup';

import ChplRequirementEdit from './requirement-edit';

import { useFetchSurveillanceTypes } from 'api/data';
import { usePutListing } from 'api/listing';
import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { getSurveillanceTitle } from 'services/surveillance.service';
import { ListingContext } from 'shared/contexts';
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
  reason: yup.string(),
});

function ChplSurveillanceEdit({ surveillance, dispatch }) {
  const { listing } = useContext(ListingContext);
  const { data, isLoading, isError } = useFetchSurveillanceTypes();
  const { mutate } = usePutListing();
  const { enqueueSnackbar } = useSnackbar();
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
    let payload;
    switch (action) {
      case 'delete':
        payload = {
          ...listing,
          surveillance: listing.surveillance.filter((s) => s.id !== surveillance.id),
        };
        break;
      case 'save':
        if (surveillance.id) {
          payload = {
            ...listing,
            surveillance: listing.surveillance.filter((s) => s.id !== surveillance.id).concat({
              ...surveillance,
              ...formik.values,
              requirements,
              type: surveillanceTypes.find((t) => t.name === formik.values.type),
            }),
          };
        } else {
          payload = {
            ...listing,
            surveillance: listing.surveillance.concat({
              ...surveillance,
              ...formik.values,
              requirements,
              type: surveillanceTypes.find((t) => t.name === formik.values.type),
            }),
          };
        }
        break;
      default:
        dispatch({ action });
    }
    if (payload) {
      mutate({
        listing: payload,
        reason: formik.values.reason,
      }, {
        onSuccess: () => {
          dispatch({ action: 'cancel' });
        },
        onError: (error) => {
          const body = error.response.data.error ?? error.response.data.errorMessages.join('; ');
          enqueueSnackbar(body, {
            variant: 'error',
          });
        },
      });
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
        dispatch({ action, payload });
    }
  };

  formik = useFormik({
    initialValues: {
      startDay: surveillance.startDay ?? '',
      endDay: surveillance.endDay ?? '',
      type: surveillance.type?.name ?? '',
      randomizedSitesUsed: surveillance.randomizedSitesUsed ?? '',
      reason: '',
    },
    validationSchema,
  });

  if (surveillanceTypes.length === 0) { return <CircularProgress />; }

  return (
    <>
      <Typography>
        { getSurveillanceTitle({
          ...surveillance,
          requirements,
        }) }
      </Typography>
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
      { !!surveillance.id
        && (
          <Card>
            <CardHeader title="Reason for Change" />
            <CardContent>
              <ChplTextField
                id="reason"
                name="reason"
                label="Reason For Change"
                value={formik.values.reason}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.reason && !!formik.errors.reason}
                helperText={formik.touched.reason && formik.errors.reason}
              />
              Reason for Change is required if the Surveillance is being deleted
            </CardContent>
          </Card>
        )}
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
