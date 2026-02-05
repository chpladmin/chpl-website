import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, bool, func, object, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import {
  criterion as criterionPropType,
} from 'shared/prop-types';

const validationSchema = yup.object({
  requiredDay: yup.date(),
  extensionEndDay: yup.date(),
  startDay: yup.date(),
});

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  chips: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    flexWrap: 'wrap',
  },
  horizontalInput: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
  },
});

function ChplCodeSetEdit({
  criterionOptions,
  dispatch,
  isProcessing,
  codeSet: initialCodeSet,
  errors: propsErrors = [],
}) {
  const [criteria, setCriteria] = useState([]);
  const [errors, setErrors] = useState([]);
  const [selectedCriterion, setSelectedCriterion] = useState('');
  const [codeSet, setCodeSet] = useState({});
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setCodeSet(initialCodeSet);
    setCriteria(initialCodeSet.criteria?.map((c) => ({
      ...c,
    })) || []);
  }, [initialCodeSet]);

  useEffect(() => {
    setErrors(propsErrors.sort((a, b) => (a < b ? -1 : 1)));
  }, [propsErrors]);

  const add = (item) => {
    setCriteria((prev) => prev.concat(item));
    setSelectedCriterion('');
  };

  const buildPayload = () => ({
    ...codeSet,
    criteria,
    requiredDay: formik.values.requiredDay,
    extensionEndDay: formik.values.extensionEndDay,
    startDay: formik.values.startDay,
  });

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        dispatch({ action: 'cancel' });
        break;
      case 'delete':
        dispatch({ action: 'delete', payload: buildPayload() });
        break;
      case 'save':
        formik.submitForm();
        break;
        // no default
    }
  };

  const isDisabled = (criterion) => criteria.filter((c) => c.id === criterion.id).length > 0;

  const isValid = () => formik.isValid && criteria.length > 0;

  const remove = (item) => {
    setCriteria((prev) => prev.filter((ele) => ele.id !== item.id));
  };

  formik = useFormik({
    initialValues: {
      requiredDay: initialCodeSet?.requiredDay ?? '',
      extensionEndDay: initialCodeSet?.extensionEndDay ?? '',
      startDay: initialCodeSet?.startDay ?? '',
    },
    onSubmit: () => {
      dispatch({ action: 'save', payload: buildPayload() });
    },
    validationSchema,
  });

  return (
    <div className={classes.container}>
      <Box className={classes.horizontalInput}>
        <ChplTextField
          id="start-day"
          name="startDay"
          label="Start Date"
          type="date"
          value={formik.values.startDay}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.startDay && !!formik.errors.startDay}
          helperText={formik.touched.startDay && formik.errors.startDay}
        />
        <ChplTextField
          id="required-day"
          name="requiredDay"
          label="Required Date"
          type="date"
          value={formik.values.requiredDay}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.requiredDay && !!formik.errors.requiredDay}
          helperText={formik.touched.requiredDay && formik.errors.requiredDay}
        />
        <ChplTextField
          id="extension-end-day"
          name="extensionEndDay"
          label="Extension End Date"
          type="date"
          value={formik.values.extensionEndDay}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.extensionEndDay && !!formik.errors.extensionEndDay}
          helperText={formik.touched.extensionEndDay && formik.errors.extensionEndDay}
        />
      </Box>
      <Divider />
      <ChplTextField
        select
        id="criteria-select"
        name="criteriaSelect"
        label="Select a criterion to associate"
        value={selectedCriterion}
        onChange={(event) => add(event.target.value)}
        helperText={criteria.length === 0 && 'At least one Criteria must be selected'}
      >
        { criterionOptions
          .sort(sortCriteria)
          .map((item) => (
            <MenuItem
              value={item}
              key={item.id}
              disabled={isDisabled(item)}
            >
              {`${item.status === 'REMOVED' ? 'Removed | ' : ''}${item.number}: ${item.title}`}
            </MenuItem>
          ))}
      </ChplTextField>
      <div className={classes.chips}>
        { criteria
          .sort(sortCriteria)
          .map((item) => (
            <Chip
              key={item.id}
              label={`${item.status === 'REMOVED' ? 'Removed | ' : ''}${item.number}`}
              onDelete={() => remove(item)}
              color="primary"
              variant="outlined"
            />
          ))}
      </div>
      <ChplActionBar
        dispatch={handleDispatch}
        canDelete={!!codeSet.id}
        errors={errors}
        isDisabled={!isValid()}
        isProcessing={isProcessing}
      />
    </div>
  );
}

export default ChplCodeSetEdit;

ChplCodeSetEdit.propTypes = {
  criterionOptions: arrayOf(criterionPropType).isRequired,
  dispatch: func.isRequired,
  errors: arrayOf(string).isRequired,
  isProcessing: bool.isRequired,
  codeSet: object.isRequired,
};
