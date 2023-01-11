import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func, string } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplActionBar } from 'components/action-bar';
import { ChplTextField } from 'components/util';
import { BreadcrumbContext } from 'shared/contexts';
import { qmsStandardType } from 'shared/prop-types';

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

function ChplQmsStandardEdit(props) {
  const { dispatch } = props;
  const { append, display, hide } = useContext(BreadcrumbContext);
  const [errors, setErrors] = useState([]);
  const [qmsStandard, setQmsStandard] = useState({});
  const classes = useStyles();
  let formik;

  useEffect(() => {
    append(
      <Button
        key="qmsStandards.add.disabled"
        depth={2}
        variant="text"
        disabled
      >
        Add
      </Button>,
    );
    append(
      <Button
        key="qmsStandards.edit.disabled"
        depth={2}
        variant="text"
        disabled
      >
        Edit
      </Button>,
    );
  }, []);

  useEffect(() => {
    setQmsStandard(props.qmsStandard);
    display(props.qmsStandard.id ? 'qmsStandards.edit.disabled' : 'qmsStandards.add.disabled');
  }, [props.qmsStandard]); // eslint-disable-line react/destructuring-assignment

  useEffect(() => {
    setErrors(props.errors.sort((a, b) => (a < b ? -1 : 1)));
  }, [props.errors]); // eslint-disable-line react/destructuring-assignment

  const buildPayload = () => ({
    ...qmsStandard,
    name: formik.values.name,
  });

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        dispatch({ action: 'cancel' });
        hide('qmsStandards.add.disabled');
        hide('qmsStandards.edit.disabled');
        break;
      case 'delete':
        dispatch({ action: 'delete', payload: buildPayload() });
        hide('qmsStandards.add.disabled');
        hide('qmsStandards.edit.disabled');
        break;
      case 'save':
        formik.submitForm();
        hide('qmsStandards.add.disabled');
        hide('qmsStandards.edit.disabled');
        break;
        // no default
    }
  };

  const isValid = () => formik.isValid;

  formik = useFormik({
    initialValues: {
      name: props.qmsStandard?.name || '', // eslint-disable-line react/destructuring-assignment
    },
    onSubmit: () => {
      props.dispatch({ action: 'save', payload: buildPayload() });
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
        canDelete={!!qmsStandard.id}
        errors={errors}
        isDisabled={!isValid()}
      />
    </div>
  );
}

export default ChplQmsStandardEdit;

ChplQmsStandardEdit.propTypes = {
  dispatch: func.isRequired,
  qmsStandard: qmsStandardType.isRequired,
  errors: arrayOf(string).isRequired,
};
