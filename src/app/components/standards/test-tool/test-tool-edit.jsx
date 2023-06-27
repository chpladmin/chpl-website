import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Chip,
  FormControlLabel,
  MenuItem,
  Switch,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { isCures, sortCriteria } from 'services/criteria.service';
import { BreadcrumbContext } from 'shared/contexts';
import { criterion as criterionPropType, testTool as testToolPropType } from 'shared/prop-types';

const validationSchema = yup.object({
  regulatoryTextCitation: yup.string()
    .required('Field is required'),
  approvedStandardVersion: yup.string()
    .required('Field is required'),
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
});

function ChplTestToolEdit(props) {
  const { criterionOptions, dispatch } = props;
  const { append, display, hide } = useContext(BreadcrumbContext);
  const [criteria, setCriteria] = useState([]);
  const [errors, setErrors] = useState([]);
  const [selectedCriterion, setSelectedCriterion] = useState('');
  const [testTool, setTestTool] = useState({});
  const classes = useStyles();
  let formik;

  useEffect(() => {
    append(
      <Button
        key="testTools.add.disabled"
        depth={2}
        variant="text"
        disabled
      >
        Add
      </Button>,
    );
    append(
      <Button
        key="testTools.edit.disabled"
        depth={2}
        variant="text"
        disabled
      >
        Edit
      </Button>,
    );
  }, []);

  useEffect(() => {
    setTestTool(props.testTool);
    setCriteria(props.testTool.criteria?.map((c) => ({
      ...c,
    })) || []);
    display(props.testTool.testToolId ? 'testTools.edit.disabled' : 'testTools.add.disabled');
  }, [props.testTool]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setErrors(props.errors.sort((a, b) => (a < b ? -1 : 1)));
  }, [props.errors]); // eslint-disable-line react/destructuring-assignment

  const add = (criterion) => {
    setCriteria((prev) => prev.concat(criterion));
    setSelectedCriterion('');
  };

  const buildPayload = () => ({
    ...testTool,
    regulatoryTextCitation: formik.values.regulatoryTextCitation,
    approvedStandardVersion: formik.values.approvedStandardVersion,
    criteria,
    replaced: formik.values.replaced,
  });

  const getDisplay = (criterion) => criterion.number + (isCures(criterion) ? ' (Cures Update)' : '');

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        dispatch({ action: 'cancel' });
        hide('testTools.add.disabled');
        hide('testTools.edit.disabled');
        break;
      case 'delete':
        dispatch({ action: 'delete', payload: buildPayload() });
        hide('testTools.add.disabled');
        hide('testTools.edit.disabled');
        break;
      case 'save':
        formik.submitForm();
        hide('testTools.add.disabled');
        hide('testTools.edit.disabled');
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
      regulatoryTextCitation: props.testTool?.regulatoryTextCitation || '', // eslint-disable-line react/destructuring-assignment
      approvedStandardVersion: props.testTool?.approvedStandardVersion || '', // eslint-disable-line react/destructuring-assignment
      replaced: props.testTool?.replaced || false, // eslint-disable-line react/destructuring-assignment
    },
    onSubmit: () => {
      props.dispatch({ action: 'save', payload: buildPayload() });
    },
    validationSchema,
  });

  return (
    <div className={classes.container}>
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
      <ChplTextField
        id="approved-standard-version"
        name="approvedStandardVersion"
        label="Approved Standard Version"
        value={formik.values.approvedStandardVersion}
        multiline
        required
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.approvedStandardVersion && !!formik.errors.approvedStandardVersion}
        helperText={formik.touched.approvedStandardVersion && formik.errors.approvedStandardVersion}
      />
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
      <FormControlLabel
        control={(
          <Switch
            id="replaced"
            name="replaced"
            color="primary"
            checked={formik.values.replaced}
            onChange={formik.handleChange}
          />
        )}
        label="Replaced"
      />
      <ChplActionBar
        dispatch={handleDispatch}
        canDelete={!!testTool.testToolId}
        errors={errors}
        isDisabled={!isValid()}
      />
    </div>
  );
}

export default ChplTestToolEdit;

ChplTestToolEdit.propTypes = {
  criterionOptions: arrayOf(criterionPropType).isRequired,
  dispatch: func.isRequired,
  testTool: testToolPropType.isRequired,
  errors: arrayOf(string).isRequired,
};
