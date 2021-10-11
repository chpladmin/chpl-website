import React, { useState } from 'react';
import {
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from '../../util';
import { changeRequest as changeRequestProp } from '../../../shared/prop-types';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
});

const validationSchema = yup.object({
  attestation: yup.string()
    .required('Attestation is required'),
});

function ChplChangeRequestAttestationEdit(props) {
  /* eslint-disable react/destructuring-assignment */
  const [changeRequest, setChangeRequest] = useState(props.changeRequest);
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  let formik;

  const handleChange = (...args) => {
    formik.handleChange(...args);
    if (formik.isValid) {
      formik.submitForm();
    }
  };

  formik = useFormik({
    initialValues: {
      attestation: changeRequest.details.attestation,
    },
    onSubmit: () => {
      props.dispatch('update', formik.values);
    },
    validationSchema,
    validateOnChange: true,
    validateOnMount: true,
  });

  return (
    <div className={classes.container}>
      <div>
        Current attestation
        <br />
        None
      </div>
      <div>
        Submitted attestation
        <br />
        <ChplTextField
          id="attestation"
          name="attestation"
          label="Attestation"
          required
          value={formik.values.attestation}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.attestation && !!formik.errors.attestation}
          helperText={formik.touched.attestation && formik.errors.attestation}
        />
      </div>
    </div>
  );
}

export default ChplChangeRequestAttestationEdit;

ChplChangeRequestAttestationEdit.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
