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
import { sortCriteria } from 'services/criteria.service';
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
  newMeasureDomain: yup.object()
    .required('Field is required'),
});

const sortTests = (first, second) => {
  const a = parseInt(first.substring(2), 10);
  const b = parseInt(second.substring(2), 10);
  return a - b;
}

const sortMeasures = (a, b) => {
  if (!a.measureType) {
    a = { measureType: 0, measure: a };
  }
  if (!b.measureType) {
    b = { measureType: 0, measure: b };
  }
  if (!a.measure.id || !b.measure.id) {
    return a.measure.id ? 1 : -1;
  }
  const getNum = test => parseInt(test.substring(2), 10);
  return a.measure.removed !== b.measure.removed ? (a.measure.removed ? 1 : -1) :
    a.measureType.name < b.measureType.name ? -1 : a.measureType.name > b.measureType.name ? 1 :
    getNum(a.measure.abbreviation) < getNum(b.measure.abbreviation) ? -1 : getNum(a.measure.abbreviation) > getNum(b.measure.abbreviation) ? 1 :
    a.measure.domain.name < b.measure.domain.name ? -1 : a.measure.domain.name > b.measure.domain.name ? 1 :
    a.measure.name < b.measure.name ? -1 : a.measure.name > b.measure.name ? 1 :
    0;
}

function ChplG1G2Add() {
  const { listing, setListing } = useContext(ListingContext);
  const [measures, setMeasures] = useState([]);
  const [tests, setTests] = useState([]);
  const [types, setTypes] = useState([]);
  const [isG1, setIsG1] = useState(true);
  const measuresQuery = useFetchMeasures();
  const measureTypesQuery = useFetchMeasureTypes();
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (measuresQuery.isLoading || !measuresQuery.isSuccess) {
      return;
    }
    setMeasures(measuresQuery.data.data
                .map((m) => ({
                  ...m,
                  displayName: `${m.removed ? 'Removed | ' : ''}${m.domain.name}`,
                  displayCriteria: [... new Set(m.allowedCriteria.map((c) => c.number))].sort(sortCriteria),
                }))
                .sort(sortMeasures));
    setTests([... new Set(measuresQuery.data.data.map((m) => m.abbreviation))]
              .sort(sortTests));
  }, [measuresQuery.data, measuresQuery.isLoading, measuresQuery.isSuccess]);

  useEffect(() => {
    if (measureTypesQuery.isLoading || !measureTypesQuery.isSuccess) {
      return;
    }
    setTypes(measureTypesQuery.data.data
             .map((t) => t)
             .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
            );
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
    formik.setFieldValue('newMeasureTest', '');
    formik.setFieldValue('newMeasureDomain', '');
    //setAddingStatus(false);
  };

  const toggleCriteria = (event) => {
    console.log(event.target.value);
  };

  const toggleType = () => {
    setIsG1((prev) => !prev);
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
        { tests.map((item) => (
          <MenuItem value={item} key={item}>{item}</MenuItem>
        ))}
      </ChplTextField>
      <ChplTextField
        select
        id="new-measure-domain"
        name="newMeasureDomain"
        label="New Test Domain"
        required
        disabled={!formik.values.newMeasureTest}
        value={formik.values.newMeasureDomain}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.newMeasureDomain && !!formik.errors.newMeasureDomain}
        helperText={formik.touched.newMeasureDomain && formik.errors.newMeasureDomain}
      >
        { measures
          .filter((m) => m.abbreviation === formik.values.newMeasureTest)
          .map((item) => (
            <MenuItem value={item} key={item.id}>{item.displayName}</MenuItem>
          ))}
      </ChplTextField>
      <FormControlLabel
        control={(
          <Switch
            id="is-g1"
            color="primary"
            size="small"
            onChange={toggleType}
            checked={isG1}
          />
        )}
        label={`${isG1 ? 'G1' : 'G2'}`}
      />
      <FormControlLabel
        label="criteria"
        key="criteria"
        control={(
          <Checkbox
            color="primary"
            name="criteria"
            value="value"
            onChange={toggleCriteria}
            checked={false}
          />
        )}
      />
    </>
  );
}

export default ChplG1G2Add;

ChplG1G2Add.propTypes = {
};
