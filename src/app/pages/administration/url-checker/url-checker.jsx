import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as yup from 'yup';
import GetAppIcon from '@material-ui/icons/GetApp';

import { ChplTextField } from 'components/util';
import { utilStyles } from 'themes';
import usePostUrlChecker from 'api/url-checker';

const useStyles = makeStyles({
  ...utilStyles,
  titlePadding: {
    paddingTop: '16px',
    paddingBottom: '16px',
  },
});

const validationSchema = yup.object({
  url: yup.string()
    .required('Field is required'),
});

function ChplUrlChecker() {
  const { enqueueSnackbar } = useSnackbar();
  const postUrlChecker = usePostUrlChecker();
  const [urlCheckResponse, setUrlCheckResponse] = useState(undefined);
  const classes = useStyles();
 
  useEffect(() => {
    if (postUrlChecker.isLoading || !postUrlChecker.isSuccess) { return; }
    setUrlCheckResponse(postUrlChecker.data.data);
    console.log(postUrlChecker.data.data);
  }, [postUrlChecker.data, postUrlChecker.isLoading, postUrlChecker.isSuccess]);

  const validate = (urlToValidate) => {
    setUrlCheckResponse(undefined);
    postUrlChecker.mutate(urlToValidate, {
      onSuccess: (data) => {
        // console.log(data);
      },
      onError: () => {
        enqueueSnackbar('There was an error attempting to check the URL.', {
          variant: 'error',
        });
      },
    });
  }

  const formik = useFormik({
    initialValues: {
      url: '',
    },
    onSubmit: () => {
      const urlToValidate = {
        url: formik.values.url,
      };
      validate(urlToValidate);
    },
    validationSchema,
  });
  
  return (
    <Container maxWidth="lg">
      <Typography className={classes.titlePadding} variant="h1">URL Checker</Typography>
      <Typography className={classes.titlePadding} variant="h2">Validate a URL</Typography>
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
        color="secondary"
        variant="contained"
        onClick={formik.handleSubmit}
        size="small"
        style={{ fontSize: 'small' }}
      >
        Validate
      </Button>
      { urlCheckResponse
          && (
            <Box>
              <Typography className={classes.titlePadding} variant="h2">Results</Typography>
              <Typography>
                URL: 
                {urlCheckResponse.url}
              </Typography>
              <Typography>
                Passed:
                {urlCheckResponse.passed.toString()}
              </Typography>
              { urlCheckResponse.errorMessage
                && (
                  <Typography>
                    Error Message:
                    {urlCheckResponse.errorMessage}
                  </Typography>
                )}
              { urlCheckResponse.httpResponseAssertion?.actualValue
                && (
                  <Typography>
                    HTTP Status Code:
                    {urlCheckResponse.httpResponseAssertion.actualValue}
                  </Typography>
                )}
              { urlCheckResponse.responseTimeAssertion?.actualValue
                && (
                  <Typography>
                    Response Time (in milliseconds):
                    {urlCheckResponse.responseTimeAssertion.actualValue}
                  </Typography>
                )}
              { urlCheckResponse.bodyNotEmptyAssertion?.actualValue
                && (
                  <Typography>
                    Body Content:
                    {urlCheckResponse.bodyNotEmptyAssertion.actualValue ? urlCheckResponse.bodyNotEmptyAssertion.actualValue : 'Empty body content'}
                  </Typography>
                )}
            </Box>
          )}
    </Container>
  );
}

export default ChplUrlChecker;

ChplUrlChecker.propTypes = {
};
