import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  MenuItem,
  Switch,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { Clear, Save } from '@material-ui/icons';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useFetchMeasures, useFetchMeasureTypes } from 'api/data';
import { ChplTextField } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { ListingContext } from 'shared/contexts';
import { utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  cancelAndSaveButton: {
    display: 'flex',
    flexDirection: 'row',
    gridGap: '8px',
    width: '100%',
  },
  criteriaForm: {
    width: '100%',
    gap: '16px',
  },
  criteriaList: {
    display: 'flex',
    flexDirection: 'row',
  },
  g1G2AddContainer:{
    alignItems: 'center',
    display: 'grid',
    gridTemplateColumns: '2fr 2fr 1fr',
    width: '100%',
    gap: '16px',
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

function ChplG1G2Add({ dispatch }) {
  const { listing, setListing } = useContext(ListingContext);
  const [measures, setMeasures] = useState([]);
  const [tests, setTests] = useState([]);
  const [types, setTypes] = useState([]);
  const [isG1, setIsG1] = useState(true);
  const [criteria, setCriteria] = useState(new Set());
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

  const add = () => {
    const measure = {
      measure: formik.values.newMeasureDomain,
      measureType: types.find((t) => isG1 ? t.name === 'G1' : t.name === 'G2'),
      associatedCriteria: formik.values.newMeasureDomain.allowedCriteria.filter((cc) => criteria.has(cc.number)),
      displayCriteria: formik.values.newMeasureDomain.requiresCriteriaSelection ? [... criteria].join('; ') : formik.values.newMeasureDomain.displayCriteria,
    };
    console.log({measure});
    setListing({
      ...listing,
      measures: [...listing.measures]
        .concat(measure),
    });
    close();
  };

  const close = () => {
    formik.setFieldValue('newMeasureTest', '');
    formik.setFieldValue('newMeasureDomain', '');
    setCriteria(new Set());
    setIsG1(true);
    dispatch();
  };

  const handleTestChange = (event) => {
    formik.setFieldValue('newMeasureDomain', '');
    setCriteria(new Set());
    formik.handleChange(event);
  };

  const toggleCriteria = (event) => {
    if (event.target.checked) {
      setCriteria((prev) => new Set(prev).add(event.target.name));
    } else {
      setCriteria((prev) => {
        const next = new Set(prev);
        next.delete(event.target.name);
        return next;
      });
    }
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
      <Typography variant="subtitle1">Adding G1/G2 Measure</Typography>
        <Box className={classes.g1G2AddContainer}>
          <ChplTextField
            select
            id="new-measure-test"
            name="newMeasureTest"
            label="New Test"
            required
            value={formik.values.newMeasureTest}
            onChange={handleTestChange}
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
            label="New Measure Domain"
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
            label={`G1/G2:  ${isG1 ? 'G1' : 'G2'}`}
          />
      </Box>
      <Box className={classes.criteriaForm}>
        { formik.values.newMeasureDomain && !formik.values.newMeasureDomain.requiresCriteriaSelection
          && (
            <Typography>
              { formik.values.newMeasureDomain.displayCriteria.join('; ') }
            </Typography>
          )}
        { formik.values.newMeasureDomain && formik.values.newMeasureDomain.requiresCriteriaSelection
          && (
            <FormControl required error={criteria.size === 0} component="fieldset">
              <FormLabel component="legend">Certification Criteria</FormLabel>
              <FormGroup className={classes.criteriaList}>
                { formik.values.newMeasureDomain.displayCriteria.map((cc) => (
                  <FormControlLabel
                    control={<Checkbox color="primary" checked={criteria.has(cc)} onChange={toggleCriteria} name={cc} />}
                    label={cc}
                    key={cc}
                  />
                ))}
              </FormGroup>
              { criteria.size === 0
                && (
                  <FormHelperText>At least one must be selected</FormHelperText>
                )}
            </FormControl>
          )}
      </Box>
      <Box className={classes.cancelAndSaveButton}>
        <Button
          size="medium"
          endIcon={<Clear fontSize="small" />}
          onClick={() => close()}
          variant="contained"
          color="secondary"
        >
          Cancel
        </Button>
        <Button
          size="medium"
          endIcon={<Save fontSize="small" />}
          variant="contained"
          color="primary"
          onClick={() => add()}
        >
          Save
        </Button>
      </Box>
    </>
  );
}

export default ChplG1G2Add;

ChplG1G2Add.propTypes = {
  dispatch: func.isRequired,
};
