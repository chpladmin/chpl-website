import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import {
  arrayOf,
  bool,
  func,
  string,
} from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar, useActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { compareStrings } from 'services/sort.service';
import { ucdProcessType } from 'shared/prop-types';

const validationSchema = yup.object({
  name: yup.string()
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

function ChplUcdProcessEdit({
  dispatch, isProcessing, ucdProcess: initialUcdProcess, errors: propsErrors = [],
}) {
  const [ucdProcess, setUcdProcess] = useState({});
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setUcdProcess(initialUcdProcess);
  }, [initialUcdProcess]);

  const buildPayload = () => ({
    ...ucdProcess,
    name: formik.values.name,
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

  const isValid = () => formik.isValid;

  formik = useFormik({
    initialValues: {
      name: initialUcdProcess?.name || '',
    },
    onSubmit: () => {
      dispatch({ action: 'save', payload: buildPayload() });
    },
    validationSchema,
  });

  useActionBar({
    canDelete: !!ucdProcess.id,
    errors: [...propsErrors].sort(compareStrings),
    isDisabled: !isValid(),
    isProcessing,
  });

  return (
    <div className={classes.container}>
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
      <ChplActionBar dispatch={handleDispatch} />
    </div>
  );
}

export default ChplUcdProcessEdit;

ChplUcdProcessEdit.propTypes = {
  dispatch: func.isRequired,
  ucdProcess: ucdProcessType.isRequired,
  errors: arrayOf(string).isRequired,
  isProcessing: bool.isRequired,
};
