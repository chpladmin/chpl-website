import React, { useContext } from 'react';
import {
  Typography,
  makeStyles,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { ChplTextField } from '../../util';
import { changeRequest as changeRequestProp } from '../../../shared/prop-types';
import { UserContext } from '../../../shared/contexts';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  submittedDetailsContainer: {
    display: 'grid',
    gap: '4px',
  },
});

const validationSchema = yup.object({
  attestation: yup.string()
    .required('Attestation is required'),
});

function ChplChangeRequestAttestationEdit(props) {
  const { hasAnyRole } = useContext(UserContext);
  const { changeRequest } = props;
  const classes = useStyles();
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
        <Typography gutterBottom variant="subtitle1">Current Attestation</Typography>
        None
      </div>
      <div className={classes.submittedDetailsContainer}>
        <Typography gutterBottom variant="subtitle1">Submitted attestation</Typography>
        <ChplTextField
          id="attestation"
          name="attestation"
          label="Attestation"
          required
          disabled={!hasAnyRole(['ROLE_DEVELOPER'])}
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
  dispatch: func.isRequired,
};
