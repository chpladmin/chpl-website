import React, { useContext, useEffect, useState } from 'react';
import {
  Chip,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  MenuItem,
  Switch,
  TableCell,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useFetchMeasures, useFetchMeasureTypes } from 'api/data';
import { ChplTextField } from 'components/util';
import { ListingContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  chips: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '4px',
    marginTop: '4px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gridGap: '16px',
    alignItems: 'flex-start',
    width: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  versionColumn: {
    width: '216px',
  },
});

const validationSchema = yup.object({
  newMeasureTest: yup.string()
    .required('Field is required'),
  newMeasureDomain: yup.string()
    .required('Field is required'),
});

function ChplG1G2Add() {
  const { listing, setListing } = useContext(ListingContext);
  const measuresQuery = useFetchMeasures();
  const measureTypesQuery = useFetchMeasureTypes();
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (measuresQuery.isLoading || !measuresQuery.isSuccess) {
      return;
    }
    console.log(measuresQuery.data);
    //setCertificationStatuses(measuresQuery.data.sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [measuresQuery.data, measuresQuery.isLoading, measuresQuery.isSuccess]);

  useEffect(() => {
    if (measureTypesQuery.isLoading || !measureTypesQuery.isSuccess) {
      return;
    }
    console.log(measureTypesQuery.data);
    //setCertificationStatuses(measureTypesQuery.data.sort((a, b) => (a.name < b.name ? -1 : 1)));
  }, [measureTypesQuery.data, measureTypesQuery.isLoading, measureTypesQuery.isSuccess]);

  const add = (v) => {
    const measure = {
      test: formik.values.newMeasureTest,
      domain: formik.values.newMeasureDomain,
      type: true,
      criteria: [],
    };
    setListing({
      ...listing,
      measures: listing.measures
        .concat({
          measure,
        }),
    });
    formik.setFieldValue('newStatusType', '');
    formik.setFieldValue('newStatusDay', '');
    formik.setFieldValue('newStatusReason', '');
    //setAddingStatus(false);
  };

  const toggleCriteria = (event) => {
    console.log(event.target.value);
  };

  const toggleType = (event) => {
    console.log(event.target.value);
  };

  formik = useFormik({
    initialValues: {
      newMeasureTest: '',
      newMeasureDomain: '',
    },
    validationSchema,
  });

  if (!listing) {
    return (
      <CircularProgress />
    );
  }

  return (
    <>
      <ChplTextField
        select
        id="new-measure-test"
        name="newMeasureTest"
        label="New Test"
        required
        value={formik.values.newMeasureTest}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.newMeasureTest && !!formik.errors.newMeasureTest}
        helperText={formik.touched.newMeasureTest && formik.errors.newMeasureTest}
      >
        { [].map((item) => (
          <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
        ))}
      </ChplTextField>
      <ChplTextField
        select
        id="new-measure-domain"
        name="newMeasureDomain"
        label="New Test Domain"
        required
        value={formik.values.newMeasureDomain}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.newMeasureDomain && !!formik.errors.newMeasureDomain}
        helperText={formik.touched.newMeasureDomain && formik.errors.newMeasureDomain}
      >
        { [].map((item) => (
          <MenuItem value={item} key={item.id}>{item.name}</MenuItem>
        ))}
      </ChplTextField>
      <Switch
        id="new-measure-type"
        color="primary"
        size="small"
        onChange={toggleType}
        checked={false}
      />
      <FormControlLabel
        label="criteria"
        key="criteria"
        control={
          <Checkbox
            color="primary"
            name="criteria"
            value="value"
            onChange={toggleCriteria}
            checked={false}
          />
        }
      />
    </>
  );
}

export default ChplG1G2Add;

ChplG1G2Add.propTypes = {
};
