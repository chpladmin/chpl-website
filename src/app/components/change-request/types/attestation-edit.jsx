import React, { useContext } from 'react';
import {
  makeStyles,
  Typography,
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
  cardHeader:{
    fontWeight:'600',
    paddingBottom:'4px',
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
    <div><Typography className={classes.cardHeader} gutterBottom variant='h4'>Editing Change Request:</Typography>
    <div className={classes.container}>
      <div>
        <Typography gutterBottom variant='subtitle1'>Current Attestation:</Typography>
        None
      </div>
      <div>
      <Typography gutterBottom variant='subtitle1'>Submitted attestation:</Typography>
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
  </div>
  );
}

export default ChplChangeRequestAttestationEdit;

ChplChangeRequestAttestationEdit.propTypes = {
  changeRequest: changeRequestProp.isRequired,
  dispatch: func.isRequired,
};
