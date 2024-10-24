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
import { sortCriteria } from 'services/criteria.service';
import { BreadcrumbContext } from 'shared/contexts';
import {
  criterion as criterionPropType,
  rule as rulePropType,
  functionalityTested as functionalityTestedPropType,
} from 'shared/prop-types';

const validationSchema = yup.object({
  value: yup.string()
    .required('Field is required'),
  regulatoryTextCitation: yup.string()
    .required('Field is required'),
  rule: yup.string(),
  practiceType: yup.string(),
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

function ChplFunctionalityTestedEdit(props) {
  const {
    criterionOptions,
    dispatch,
    rules,
    functionalityTested: initialFunctionalityTested,
  } = props;
  const practiceTypes = [{ id: 1, name: 'Ambulatory' }, { id: 2, name: 'Inpatient' }];
  const practiceTypeOptions = ['Ambulatory', 'Inpatient', 'N/A'];
  const { append, display, hide } = useContext(BreadcrumbContext);
  const [criteria, setCriteria] = useState([]);
  const [errors, setErrors] = useState([]);
  const [ruleOptions, setRuleOptions] = useState([]);
  const [selectedCriterion, setSelectedCriterion] = useState('');
  const [functionalityTested, setFunctionalityTested] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    append(
      <Button
        key="functionalitiesTested.add.disabled"
        depth={2}
        variant="text"
        disabled
      >
        Add
      </Button>,
    );
    append(
      <Button
        key="functionalitiesTested.edit.disabled"
        depth={2}
        variant="text"
        disabled
      >
        Edit
      </Button>,
    );
  }, []);

  useEffect(() => {
    setFunctionalityTested(initialFunctionalityTested);
    setCriteria(initialFunctionalityTested.criteria?.map((c) => ({
      ...c,
    })) || []);
    display(initialFunctionalityTested.id ? 'functionalitiesTested.edit.disabled' : 'functionalitiesTested.add.disabled');
  }, [initialFunctionalityTested]);

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
    ...functionalityTested,
    value: formik.values.value,
    regulatoryTextCitation: formik.values.regulatoryTextCitation,
    rule: rules.find((rule) => rule.name === formik.values.rule),
    practiceType: practiceTypes.find((practiceType) => practiceType.name === formik.values.practiceType),
    additionalInformation: formik.values.additionalInformation,
    criteria,
    endDay: formik.values.endDay,
    requiredDay: formik.values.requiredDay,
    startDay: formik.values.startDay,
  });

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        dispatch({ action: 'cancel' });
        hide('functionalitiesTested.add.disabled');
        hide('functionalitiesTested.edit.disabled');
        break;
      case 'delete':
        dispatch({ action: 'delete', payload: buildPayload() });
        hide('functionalitiesTested.add.disabled');
        hide('functionalitiesTested.edit.disabled');
        break;
      case 'save':
        setIsProcessing(true);
        formik.submitForm();
        hide('functionalitiesTested.add.disabled');
        hide('functionalitiesTested.edit.disabled');
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
      value: initialFunctionalityTested?.value ?? '',
      regulatoryTextCitation: initialFunctionalityTested?.regulatoryTextCitation ?? '',
      rule: initialFunctionalityTested?.rule?.name ?? '',
      practiceType: initialFunctionalityTested?.practiceType?.name ?? '',
      additionalInformation: initialFunctionalityTested?.additionalInformation ?? '',
      endDay: initialFunctionalityTested?.endDay ?? '',
      requiredDay: initialFunctionalityTested?.requiredDay ?? '',
      startDay: initialFunctionalityTested?.startDay ?? '',
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
          id="end-day"
          name="endDay"
          label="End Date"
          type="date"
          value={formik.values.endDay}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.endDay && !!formik.errors.endDay}
          helperText={formik.touched.endDay && formik.errors.endDay}
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
        id="practiceType"
        name="practiceType"
        label="Select a Practice Type"
        value={formik.values.practiceType}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
      >
        { practiceTypeOptions
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
        canDelete={!!functionalityTested.id}
        errors={errors}
        isDisabled={!isValid()}
        isProcessing={isProcessing}
      />
    </div>
  );
}

export default ChplFunctionalityTestedEdit;

ChplFunctionalityTestedEdit.propTypes = {
  criterionOptions: arrayOf(criterionPropType).isRequired,
  dispatch: func.isRequired,
  errors: arrayOf(string).isRequired,
  rules: arrayOf(rulePropType).isRequired,
  functionalityTested: functionalityTestedPropType.isRequired,
};
