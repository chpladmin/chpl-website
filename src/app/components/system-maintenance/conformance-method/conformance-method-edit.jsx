import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import {
  arrayOf, bool, func, string,
} from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import {
  criterion as criterionPropType,
  conformanceMethod as conformanceMethodPropType,
} from 'shared/prop-types';

const validationSchema = yup.object({
  name: yup.string()
    .required('Field is required'),
  removalDate: yup.date(),
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

function ChplConformanceMethodEdit(props) {
  const {
    criterionOptions,
    dispatch,
    isProcessing,
    conformanceMethod: initialConformanceMethod,
  } = props;
  const [criteria, setCriteria] = useState([]);
  const [errors, setErrors] = useState([]);
  const [selectedCriterion, setSelectedCriterion] = useState('');
  const [conformanceMethod, setConformanceMethod] = useState({});
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setConformanceMethod(initialConformanceMethod);
    setCriteria(initialConformanceMethod.criteria?.map((c) => ({
      ...c,
    })) || []);
  }, [initialConformanceMethod]);

  useEffect(() => {
    setErrors(props.errors.sort((a, b) => (a < b ? -1 : 1))); // eslint-disable-line react/destructuring-assignment
  }, [props.errors]); // eslint-disable-line react/destructuring-assignment

  const add = (item) => {
    setCriteria((prev) => prev.concat(item));
    setSelectedCriterion('');
  };

  const buildPayload = () => ({
    ...conformanceMethod,
    name: formik.values.name,
    criteria,
    removalDate: formik.values.removalDate,
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
      name: initialConformanceMethod?.name ?? '',
      removalDate: initialConformanceMethod?.removalDate ?? '',
      requiredDay: initialConformanceMethod?.requiredDay,
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
          id="name"
          name="name"
          label="Name"
          value={formik.values.name}
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && !!formik.errors.name}
          helperText={formik.touched.name && formik.errors.name}
        />
      </Box>
      <Box className={classes.horizontalInput}>
        <ChplTextField
          id="removal-date"
          name="removalDate"
          label="Removal Date"
          type="date"
          value={formik.values.removalDate}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.removalDate && !!formik.errors.removalDate}
          helperText={formik.touched.removalDate && formik.errors.removalDate}
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
        canDelete={!!conformanceMethod.id}
        errors={errors}
        isDisabled={!isValid()}
        isProcessing={isProcessing}
      />
    </div>
  );
}

export default ChplConformanceMethodEdit;

ChplConformanceMethodEdit.propTypes = {
  criterionOptions: arrayOf(criterionPropType).isRequired,
  dispatch: func.isRequired,
  errors: arrayOf(string).isRequired,
  isProcessing: bool.isRequired,
  conformanceMethod: conformanceMethodPropType.isRequired,
};
