import React from 'react';
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
  website: yup.string()
    .url('Website is not in a valid format')
    .required('Website is required'),
});

function ChplChangeRequestWebsiteEdit(props) {
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
      website: changeRequest.details.website,
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
        Current website
        <br />
        {changeRequest.developer.website}
      </div>
      <div>
        Submitted website
        <br />
        <ChplTextField
          id="website"
          name="website"
          label="Website"
          required
          value={formik.values.website}
          onChange={handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.website && !!formik.errors.website}
          helperText={formik.touched.website && formik.errors.website}
        />
      </div>
    </div>
  );
}

export default ChplChangeRequestWebsiteEdit;

ChplChangeRequestWebsiteEdit.propTypes = {
  changeRequest: changeRequestProp.isRequired,
  dispatch: func.isRequired,
};
