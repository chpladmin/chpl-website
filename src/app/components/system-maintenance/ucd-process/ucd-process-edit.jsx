import React, { useEffect, useState } from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, bool, func, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
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

function ChplUcdProcessEdit(props) {
  const { dispatch, isProcessing } = props;
  const [errors, setErrors] = useState([]);
  const [ucdProcess, setUcdProcess] = useState({});
  const classes = useStyles();
  let formik;

  useEffect(() => {
    setUcdProcess(props.ucdProcess);
  }, [props.ucdProcess]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setErrors(props.errors.sort((a, b) => (a < b ? -1 : 1)));
  }, [props.errors]); // eslint-disable-line react/destructuring-assignment

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
      name: props.ucdProcess?.name || '', // eslint-disable-line react/destructuring-assignment
    },
    onSubmit: () => {
      dispatch({ action: 'save', payload: buildPayload() });
    },
    validationSchema,
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
      <ChplActionBar
        dispatch={handleDispatch}
        canDelete={!!ucdProcess.id}
        errors={errors}
        isDisabled={!isValid()}
        isProcessing={isProcessing}
      />
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
