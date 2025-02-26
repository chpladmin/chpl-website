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
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

import { ChplTextField } from 'components/util';
import { utilStyles, palette } from 'themes';
import usePostUrlChecker from 'api/url-checker';

const useStyles = makeStyles((theme) => ({
  ...utilStyles,
  titlePadding: {
    paddingTop: '16px',
    paddingBottom: '16px',
  },
  titleBackground: {
    backgroundColor: palette.white,
    paddingBottom: '16px',
    marginTop: '-16px',
    padding: '16px 32px',
    boxShadow: 'rgb(149 157 165 / 10%) 0 4px 8px',
  },
  pageBackground: {
    backgroundColor: palette.lightGray,
    minHeight: 'calc(100vh - 64px)',
  },
  resultsCard: {
    width: '32.3%',
    overflowWrap: 'break-word',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  resultsCardHalf: {
    width: '49.2%',
    overflowWrap: 'break-word',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  statusText: {
    display: 'flex',
    alignItems: 'center',
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    paddingBottom: '16px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
}));

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
        </Container>
      </Box>
      <Container className={classes.pageBackground} maxWidth="lg">
        {(postUrlChecker.isLoading || postUrlChecker.isLoading) && (
          <Box py={4}>
            <CircularProgress />
          </Box>
        )}
        {urlCheckResponse
          && (
            <>
              <Typography className={classes.titlePadding} component="h2" variant="h5" style={{ fontWeight: 600 }}>Results</Typography>
              <Box className={classes.resultsContainer}>
                <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={{ enter: 500 }}>
                  <Card className={classes.resultsCardHalf} style={{ zIndex: 5 }}>
                    <CardContent>
                      <Typography variant="h6" style={{ fontWeight: 600 }}>
                        Status:
                      </Typography>
                      <Typography variant='h6' className={classes.statusText}>
                        {urlCheckResponse.passed.toString()}
                        {urlCheckResponse.passed
                          ? (
                            <CheckCircleIcon fontSize="large" style={{ color: 'green', marginLeft: '8px', marginTop: '4px' }} />
                          ) : (
                            <CancelIcon fontSize="large" style={{ color: 'red', marginLeft: '8px', marginTop: '4px' }} />
                          )}
                      </Typography>
                      {urlCheckResponse.errorMessage
                        && (
                          <>
                            <Typography variant='body2'>
                              Error Message:
                            </Typography>
                            <Typography variant="body2">{urlCheckResponse.errorMessage}</Typography>
                          </>
                        )}
                    </CardContent>
                  </Card>
                </Slide>
                <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={{ enter: 1000 }}>
                  <Card className={classes.resultsCardHalf} style={{ zIndex: 4 }}>
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
              </Box>
              <Box className={classes.resultsContainer}>
                <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={{ enter: 1500 }}>
                  <Card className={classes.resultsCard} style={{ zIndex: 3 }}>
                    <CardContent>
                      {urlCheckResponse.httpResponseAssertion?.actualValue ? (
                        <>
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            HTTP Status Code:
                          </Typography>
                          <Box className={classes.statusText}>
                            <Typography>
                              {urlCheckResponse.httpResponseAssertion.actualValue}
                            </Typography>
                            {urlCheckResponse.httpResponseAssertion.passed
                              ? (
                                <CheckCircleIcon fontSize="large" style={{ color: 'green', marginLeft: '8px', marginTop: '4px' }} />
                              ) : (
                                <CancelIcon fontSize="large" style={{ color: 'red', marginLeft: '8px', marginTop: '4px' }} />
                              )}
                          </Box>
                          <Typography variant="body2">
                            <a
                              href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Reference for HTTP Status Codes
                            </a>
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            No HTTP Status Code Available:
                          </Typography>
                          <Box className={classes.statusText}>
                            <Typography>
                              The HTTP response code could not be retrieved or is unavailable.
                            </Typography>
                            {urlCheckResponse.httpResponseAssertion.passed
                              ? (
                                <CheckCircleIcon fontSize="large" style={{ color: 'green', marginLeft: '8px', marginTop: '4px' }} />
                              ) : (
                                <CancelIcon fontSize="large" style={{ color: 'red', marginLeft: '8px', marginTop: '4px' }} />
                              )}
                          </Box>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Slide>
                <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={{ enter: 2000 }}>
                  <Card className={classes.resultsCard} style={{ zIndex: 2 }}>
                    <CardContent>
                      {urlCheckResponse.responseTimeAssertion?.actualValue
                        && (
                          <>
                            <Typography variant='h6' style={{ fontWeight: 600 }}>
                              Response Time (in milliseconds):
                            </Typography>
                            <Box className={classes.statusText}>
                              <Typography>
                                {urlCheckResponse.responseTimeAssertion.actualValue}
                              </Typography>
                              {urlCheckResponse.responseTimeAssertion.passed
                                ? (
                                  <CheckCircleIcon fontSize="large" style={{ color: 'green', marginLeft: '8px', marginTop: '4px' }} />
                                ) : (
                                  <CancelIcon fontSize="large" style={{ color: 'red', marginLeft: '8px', marginTop: '4px' }} />
                                )}
                            </Box>
                          </>
                        )}
                    </CardContent>
                  </Card>
                </Slide>
                <Slide direction="right" in={true} mountOnEnter unmountOnExit timeout={{ enter: 2500 }}>
                  <Card className={classes.resultsCard} style={{ zIndex: 1 }}>
                    <CardContent>
                      {urlCheckResponse.bodyNotEmptyAssertion?.actualValue ? (
                        <>
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            Body Content:
                          </Typography>
                          <Box className={classes.statusText}>
                            <Typography>
                              {urlCheckResponse.bodyNotEmptyAssertion.actualValue
                                ? urlCheckResponse.bodyNotEmptyAssertion.actualValue
                                : 'Empty body content'}
                            </Typography>
                            {urlCheckResponse.bodyNotEmptyAssertion.passed
                              ? (
                                <CheckCircleIcon fontSize="large" style={{ color: 'green', marginLeft: '8px', marginTop: '4px' }} />
                              ) : (
                                <CancelIcon fontSize="large" style={{ color: 'red', marginLeft: '8px', marginTop: '4px' }} />
                              )}
                          </Box>
                        </>
                      ) : (
                        <>
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            No Content Available:
                          </Typography>
                          <Box className={classes.statusText}>
                            <Typography>
                              The body content is empty or unavailable.
                            </Typography>
                            {urlCheckResponse.bodyNotEmptyAssertion.passed
                              ? (
                                <CheckCircleIcon fontSize="large" style={{ color: 'green', marginLeft: '8px', marginTop: '4px' }} />
                              ) : (
                                <CancelIcon fontSize="large" style={{ color: 'red', marginLeft: '8px', marginTop: '4px' }} />
                              )}
                          </Box>
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