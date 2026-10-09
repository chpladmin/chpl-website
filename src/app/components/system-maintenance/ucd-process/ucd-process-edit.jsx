import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import {
  arrayOf, bool, func, string,
} from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar, useActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { ucdProcessType } from 'shared/prop-types';

const validationSchema = yup.object({
  name: yup.string()
    .required('Field is required'),
});

const styles = {
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
};

function ChplUcdProcessEdit({
  dispatch, isProcessing, ucdProcess: initialUcdProcess, errors: propsErrors = [],
}) {
  const [ucdProcess, setUcdProcess] = useState({});
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
    errors: [...propsErrors].sort((a, b) => (a < b ? -1 : 1)),
    isDisabled: !isValid(),
    isProcessing,
  });

  return (
    <Box sx={styles.container}>
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
    </Box>
  );
}

export default ChplUcdProcessEdit;

ChplUcdProcessEdit.propTypes = {
  dispatch: func.isRequired,
  ucdProcess: ucdProcessType.isRequired,
  errors: arrayOf(string).isRequired,
  isProcessing: bool.isRequired,
};
