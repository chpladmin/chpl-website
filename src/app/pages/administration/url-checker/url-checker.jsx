import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
  makeStyles,
  Slide,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as yup from 'yup';

import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import { ChplTextField } from 'components/util';
import { utilStyles, palette } from 'themes';
import usePostUrlChecker from 'api/url-checker';

const useStyles = makeStyles({
  ...utilStyles,
  titlePadding: {
    paddingTop: '16px',
    paddingBottom: '16px',
  },
  titleBackground: {
    backgroundColor: palette.white,
    paddingBottom: '16px',
    marginLeft: '-32px',
    marginRight: '-32px',
    marginTop: '-16px',
    padding: '16px 32px',
    boxShadow: 'rgb(149 157 165 / 10%) 0 4px 8px',
  },
  pageBackground: {
    backgroundColor: palette.lightGray,
    minHeight: 'calc(100vh - 64px)',
  },
  resultsCard: {
    width: '32.8%',
    overflowWrap: 'break-word',
  },
  resultsCardHalf: {
    width: '49.5%',
    overflowWrap: 'break-word',
  },
});

const validationSchema = yup.object({
  url: yup.string()
    .required('Field is required')
    .url('Improper format (http://www.example.com)'),
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
    <>
      <Box className={classes.titleBackground}>
        <Container maxWidth="lg">
          <Typography className={classes.titlePadding} variant="h1">URL Checker</Typography>
          <Typography className={classes.titlePadding} variant="h5" component="h2" style={{ fontWeight: 600 }}>Validate a URL</Typography>
          <Box display="flex" alignItems="flex-start" gridGap={8}>
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
              style={{ fontSize: 'small', padding: '10px' }}
            >
              Validate
            </Button>
          </Box>
        </Container>
      </Box>
      <Container className={classes.pageBackground} maxWidth="lg">
        {(postUrlChecker.isLoading || postUrlChecker.isLoading) && (
          <CircularProgress />
        )}
        {urlCheckResponse
          && (
            <>
              <Typography className={classes.titlePadding} component="h2" variant="h5" style={{ fontWeight: 600 }}>Results</Typography>
              <Box mb={8} display="flex" gridGap={8} flexWrap="wrap">
                <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={{ enter: 500 }}>
                  <Card className={classes.resultsCard} style={{ zIndex: 5 }}>
                    <CardContent>
                      <Typography variant="h6" style={{ fontWeight: 600 }}>
                        Status:
                      </Typography>
                      <Typography variant='h6'>
                        {urlCheckResponse.passed.toString()}
                        {urlCheckResponse.passed && <CheckCircleIcon size="large" style={{ color: 'green', marginLeft: '8px' }} />}
                      </Typography>
                      {urlCheckResponse.errorMessage
                        && (
                          <Typography>
                            Error Message:
                            {urlCheckResponse.errorMessage}
                          </Typography>
                        )}
                    </CardContent>
                  </Card>
                </Slide>
                <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={{ enter: 1000 }}>
                  <Card className={classes.resultsCard} style={{ zIndex: 4 }}>
                    <CardContent>
                      <Typography variant="h6" style={{ fontWeight: 600 }}>
                        URL:
                      </Typography>
                      <Typography>
                        {urlCheckResponse.url}
                      </Typography>
                    </CardContent>
                  </Card>
                </Slide>
                <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={{ enter: 1500 }}>
                  <Card className={classes.resultsCard} style={{ zIndex: 3 }}>
                    <CardContent>
                      {urlCheckResponse.httpResponseAssertion?.actualValue
                        && (
                          <>
                            <Typography variant="h6" style={{ fontWeight: 600 }}>
                              HTTP Status Code:
                            </Typography>
                            <Typography>
                              {urlCheckResponse.httpResponseAssertion.actualValue}
                            </Typography>
                            <Typography variant="body2">
                              <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status" target="_blank" rel="noopener noreferrer">
                              Reference for HTTP Status Codes
                              </a>
                            </Typography>
                          </>
                        )}
                    </CardContent>
                  </Card>
                </Slide>
                </Box>
                <Box display="flex" gridGap={8} flexWrap="wrap">
                <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={{ enter: 2000 }}>
                  <Card className={classes.resultsCardHalf} style={{ zIndex: 2 }}>
                    <CardContent>
                      {urlCheckResponse.responseTimeAssertion?.actualValue
                        && (
                          <>
                            <Typography variant='h6' style={{ fontWeight: 600 }}>
                              Response Time (in milliseconds):
                            </Typography>
                            <Typography>
                              {urlCheckResponse.responseTimeAssertion.actualValue}
                            </Typography>
                          </>
                        )}
                    </CardContent>
                  </Card>
                </Slide>
                <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={{ enter: 2500 }}>
                  <Card className={classes.resultsCardHalf} style={{ zIndex: 1 }}>
                    <CardContent>
                      {urlCheckResponse.bodyNotEmptyAssertion?.actualValue
                        && (
                          <>
                            <Typography variant="h6" style={{ fontWeight: 600 }}>
                              Body Content:
                            </Typography>
                            <Typography>
                              {urlCheckResponse.bodyNotEmptyAssertion.actualValue ? urlCheckResponse.bodyNotEmptyAssertion.actualValue : 'Empty body content'}
                            </Typography>
                          </>
                        )}
                    </CardContent>
                  </Card>
                </Slide>
                </Box>
            </>
          )}
      </Container>
    </>
  );
}

export default ChplUrlChecker;

ChplUrlChecker.propTypes = {
};