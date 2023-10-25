import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { isCures, sortCriteria } from 'services/criteria.service';
import { BreadcrumbContext } from 'shared/contexts';
import {
  criterion as criterionPropType,
  rule as rulePropType,
  standard as standardPropType,
} from 'shared/prop-types';

const validationSchema = yup.object({
  value: yup.string()
    .required('Field is required'),
  regulatoryTextCitation: yup.string()
    .required('Field is required'),
  rule: yup.string(),
  additionalInformation: yup.string(),
  endDay: yup.date(),
  requiredDay: yup.date(),
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

function ChplStandardEdit(props) {
  const {
    criterionOptions,
    dispatch,
    rules,
    standard: initialStandard,
  } = props;
  const { append, display, hide } = useContext(BreadcrumbContext);
  const [criteria, setCriteria] = useState([]);
  const [errors, setErrors] = useState([]);
  const [ruleOptions, setRuleOptions] = useState([]);
  const [selectedCriterion, setSelectedCriterion] = useState('');
  const [standard, setStandard] = useState({});
  const classes = useStyles();
  let formik;

  useEffect(() => {
    append(
      <Button
        key="standards.add.disabled"
        depth={2}
        variant="text"
        disabled
      >
        Add
      </Button>,
    );
    append(
      <Button
        key="standards.edit.disabled"
        depth={2}
        variant="text"
        disabled
      >
        Edit
      </Button>,
    );
  }, []);

  useEffect(() => {
    setStandard(initialStandard);
    setCriteria(initialStandard.criteria?.map((c) => ({
      ...c,
    })) || []);
    display(initialStandard.id ? 'standards.edit.disabled' : 'standards.add.disabled');
  }, [initialStandard]);

  useEffect(() => {
    setRuleOptions(rules.map((rule) => rule.name).sort((a, b) => (a < b ? -1 : 1)));
  }, [rules]);

  useEffect(() => {
    setErrors(props.errors.sort((a, b) => (a < b ? -1 : 1))); // eslint-disable-line react/destructuring-assignment
  }, [props.errors]); // eslint-disable-line react/destructuring-assignment

  const add = (item) => {
    setCriteria((prev) => prev.concat(item));
    setSelectedCriterion('');
  };

  const buildPayload = () => ({
    ...standard,
    value: formik.values.value,
    regulatoryTextCitation: formik.values.regulatoryTextCitation,
    rule: rules.find((rule) => rule.name === formik.values.rule),
    additionalInformation: formik.values.additionalInformation,
    criteria,
    endDay: formik.values.endDay,
    requiredDay: formik.values.requiredDay,
    startDay: formik.values.startDay,
  });

  const getDisplay = (criterion) => criterion.number + (isCures(criterion) ? ' (Cures Update)' : '');

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        dispatch({ action: 'cancel' });
        hide('standards.add.disabled');
        hide('standards.edit.disabled');
        break;
      case 'delete':
        dispatch({ action: 'delete', payload: buildPayload() });
        hide('standards.add.disabled');
        hide('standards.edit.disabled');
        break;
      case 'save':
        formik.submitForm();
        hide('standards.add.disabled');
        hide('standards.edit.disabled');
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
      value: initialStandard?.value ?? '',
      regulatoryTextCitation: initialStandard?.regulatoryTextCitation ?? '',
      rule: initialStandard?.rule?.name ?? '',
      additionalInformation: initialStandard?.additionalInformation ?? '',
      endDay: initialStandard?.endDay ?? '',
      requiredDay: initialStandard?.requiredDay ?? '',
      startDay: initialStandard?.startDay ?? '',
    },
    onSubmit: () => {
      dispatch({ action: 'save', payload: buildPayload() });
    },
    validationSchema,
  });

  if (ruleOptions.length === 0) { return null; }

  return (
    <div className={classes.container}>
      <Box className={classes.horizontalInput}>
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
        <ChplTextField
          id="regulatory-text-citation"
          name="regulatoryTextCitation"
          label="Regulatory Text Citation"
          value={formik.values.regulatoryTextCitation}
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.regulatoryTextCitation && !!formik.errors.regulatoryTextCitation}
          helperText={formik.touched.regulatoryTextCitation && formik.errors.regulatoryTextCitation}
        />
      </Box>
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
          className={classes.date}
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
          className={classes.date}
        />
        <ChplTextField
          id="end-day"
          name="endDay"
          label="End Date"
          type="date"
          value={formik.values.endDay}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.endDay && !!formik.errors.endDay}
          helperText={formik.touched.endDay && formik.errors.endDay}
          className={classes.date}
        />
      </Box>
      <Divider />
      <ChplTextField
        select
        id="rule"
        name="rule"
        label="Select a Rule"
        value={formik.values.rule}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      >
        { ruleOptions
          .map((item) => (
            <MenuItem
              value={item}
              key={item}
            >
              { item }
            </MenuItem>
          ))}
      </ChplTextField>
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
              {`${item.number}: ${item.title}`}
            </MenuItem>
          ))}
      </ChplTextField>
      <div className={classes.chips}>
        { criteria
          .sort(sortCriteria)
          .map((item) => (
            <Chip
              key={item.id}
              label={getDisplay(item)}
              onDelete={() => remove(item)}
              color="primary"
              variant="outlined"
            />
          ))}
      </div>
      <ChplTextField
        id="additional-information"
        name="additionalInformation"
        label="Additional Information"
        value={formik.values.additionalInformation}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      />
      <ChplActionBar
        dispatch={handleDispatch}
        canDelete={!!standard.id}
        errors={errors}
        isDisabled={!isValid()}
      />
    </div>
  );
}

export default ChplStandardEdit;

ChplStandardEdit.propTypes = {
  criterionOptions: arrayOf(criterionPropType).isRequired,
  dispatch: func.isRequired,
  errors: arrayOf(string).isRequired,
  rules: arrayOf(rulePropType).isRequired,
  standard: standardPropType.isRequired,
};
