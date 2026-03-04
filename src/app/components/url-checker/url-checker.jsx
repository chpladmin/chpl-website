import React from 'react';
import {
  Box,
  Button,
} from '@material-ui/core';
import { func } from 'prop-types';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as yup from 'yup';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

import usePostUrlChecker from 'api/url-checker';
import { ChplTextField } from 'components/util';

const validationSchema = yup.object({
  url: yup.string()
    .required('Field is required')
    .url('Improper format (http://www.example.com)'),
});

function ChplUrlChecker({ dispatch }) {
  const { enqueueSnackbar } = useSnackbar();
  const { mutate } = usePostUrlChecker();

  const validate = (payload) => {
    dispatch({ action: 'loading' });
    mutate(payload, {
      onSuccess: (response) => {
        dispatch({ action: 'complete', payload: response.data });
      },
      onError: () => {
        enqueueSnackbar('There was an error attempting to check the URL.', {
          variant: 'error',
        });
        dispatch({ action: 'complete' });
      },
    });
  };

  const formik = useFormik({
    initialValues: {
      url: '',
    },
    onSubmit: () => {
      validate({
        url: formik.values.url,
      });
    },
    validationSchema,
  });

  return (
    <Box display="flex" alignItems="flex-start">
      <ChplTextField
        id="url"
        name="url"
        label="URL to check"
        value={formik.values.url}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.url && !!formik.errors.url}
        helperText={formik.touched.url && formik.errors.url}
        required
      />
      <Button
        id="validate-url"
        aria-label="Validate URL"
        color="primary"
        variant="contained"
        onClick={formik.handleSubmit}
        size="small"
        style={{ marginLeft: '-4px', fontSize: 'small', padding: '9px' }}
        endIcon={<VerifiedUserIcon />}
      >
        Validate
      </Button>
    </Box>
  );
}

export default ChplUrlChecker;

ChplUrlChecker.propTypes = {
  dispatch: func.isRequired,
};
