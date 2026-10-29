import React, { useContext, useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, CircularProgress, Container, Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as yup from 'yup';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

import { usePostUrlChecker } from 'api/url-checker';
import { ChplLink, ChplTextField } from 'components/util';
import { UserContext } from 'shared/contexts';
import { utilStyles, palette, theme } from 'themes';

const styles = {
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
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  resultsCardHalf: {
    width: '49.2%',
    overflowWrap: 'break-word',
    [theme.breakpoints.down('md')]: {
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
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
  greenIcon: {
    color: 'green',
    marginLeft: '8px',
    marginTop: '4px',
  },
  redIcon: {
    color: 'red',
    marginLeft: '8px',
    marginTop: '4px',
  },
};

const validationSchema = yup.object({
  url: yup.string()
    .required('Field is required')
    .url('Improper format (http://www.example.com)'),
});

function ChplUrlChecker() {
  const { hasAnyRole } = useContext(UserContext);
  const { enqueueSnackbar } = useSnackbar();
  const {
    data,
    isLoading,
    isSuccess,
    mutate,
  } = usePostUrlChecker();
  const [urlCheckResponse, setUrlCheckResponse] = useState(undefined);

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setUrlCheckResponse(data.data);
  }, [data, isLoading, isSuccess]);

  const validate = (urlToValidate) => {
    setUrlCheckResponse(undefined);
    mutate(urlToValidate, {
      onError: () => {
        enqueueSnackbar('There was an error attempting to check the URL.', {
          variant: 'error',
        });
      },
    });
  };

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

  const displayStatusIcon = (passed) => {
    if (passed) {
      return (
        <CheckCircleIcon fontSize="large" sx={styles.greenIcon} />
      );
    }
    return (
      <CancelIcon fontSize="large" sx={styles.redIcon} />
    );
  };

  return (
    <>
      <Box sx={styles.titleBackground}>
        <Container maxWidth="lg">
          <Typography sx={styles.titlePadding} variant="h1">URL Checker</Typography>
          <Typography sx={styles.titlePadding} variant="h5" component="h2" style={{ fontWeight: 600 }}>Validate a URL</Typography>
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
      <Container sx={styles.pageBackground} maxWidth="lg">
        { isLoading
          && (
            <Box py={4}>
              <CircularProgress />
            </Box>
          )}
        {urlCheckResponse
          && (
            <>
              <Typography sx={styles.titlePadding} component="h2" variant="h5" style={{ fontWeight: 600 }}>Results</Typography>
              <Box sx={styles.resultsContainer}>
                <Card sx={styles.resultsCardHalf}>
                  <CardContent>
                    <Typography variant="h6" style={{ fontWeight: 600 }}>
                      Status:
                    </Typography>
                    <Typography variant="h6" sx={styles.statusText}>
                      {urlCheckResponse.passed ? 'Passed' : 'Failure'}
                      {displayStatusIcon(urlCheckResponse.passed)}
                    </Typography>
                    {urlCheckResponse.errorMessage
                      && (
                        <>
                          <Typography variant="body2">
                            Error Message:
                          </Typography>
                          <Typography variant="body2">{urlCheckResponse.errorMessage}</Typography>
                        </>
                      )}
                  </CardContent>
                </Card>
                <Card sx={styles.resultsCardHalf}>
                  <CardContent>
                    <Typography variant="h6" style={{ fontWeight: 600 }}>
                      URL:
                    </Typography>
                    <Typography>
                      {urlCheckResponse.url}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
              { (hasAnyRole(['chpl-admin', 'chpl-onc']) || !urlCheckResponse.passed)
                && (
                  <>
                    <Typography sx={styles.titlePadding} component="h3" variant="h6" style={{ fontWeight: 600 }}>Assertions</Typography>
                    <Box sx={styles.resultsContainer}>
                      <Card sx={styles.resultsCard}>
                        <CardContent>
                          {urlCheckResponse.httpResponseAssertion?.actualValue ? (
                            <>
                              <Typography variant="h6" style={{ fontWeight: 600 }}>
                                HTTP Status Code:
                              </Typography>
                              <Box sx={styles.statusText}>
                                <Typography>
                                  {urlCheckResponse.httpResponseAssertion.actualValue}
                                </Typography>
                                {displayStatusIcon(urlCheckResponse.httpResponseAssertion.passed)}
                              </Box>
                              <Typography variant="body2">
                                <ChplLink
                                  href="https://developer.mozilla.org/en-US/docs/Web/HTTP/Status"
                                  text="Reference for HTTP Status Codes"
                                  external
                                  inline
                                />
                              </Typography>
                            </>
                          ) : (
                            <>
                              <Typography variant="h6" style={{ fontWeight: 600 }}>
                                No HTTP Status Code Available:
                              </Typography>
                              <Box sx={styles.statusText}>
                                <Typography>
                                  The HTTP response code could not be retrieved or is unavailable.
                                </Typography>
                                {displayStatusIcon(urlCheckResponse.httpResponseAssertion.passed)}
                              </Box>
                            </>
                          )}
                        </CardContent>
                      </Card>
                      <Card sx={styles.resultsCard}>
                        <CardContent>
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            Response Time (in milliseconds):
                          </Typography>
                          {urlCheckResponse.responseTimeAssertion?.actualValue
                            ? (
                              <>
                                <Box sx={styles.statusText}>
                                  <Typography>
                                    {urlCheckResponse.responseTimeAssertion.actualValue}
                                  </Typography>
                                  {displayStatusIcon(urlCheckResponse.responseTimeAssertion.passed)}
                                </Box>
                              </>
                            ) : (
                              <>
                                <Box sx={styles.statusText}>
                                  <Typography>
                                    The response time is empty or unavailable.
                                  </Typography>
                                  {displayStatusIcon(urlCheckResponse.responseTimeAssertion.passed)}
                                </Box>
                              </>
                            )}
                        </CardContent>
                      </Card>
                      <Card sx={styles.resultsCard}>
                        <CardContent>
                          {urlCheckResponse.bodyNotEmptyAssertion?.actualValue ? (
                            <>
                              <Typography variant="h6" style={{ fontWeight: 600 }}>
                                Body Content:
                              </Typography>
                              <Box sx={styles.statusText}>
                                <Typography>
                                  {urlCheckResponse.bodyNotEmptyAssertion.actualValue
                                    ? urlCheckResponse.bodyNotEmptyAssertion.actualValue
                                    : 'Empty body content'}
                                </Typography>
                                {displayStatusIcon(urlCheckResponse.bodyNotEmptyAssertion.passed)}
                              </Box>
                            </>
                          ) : (
                            <>
                              <Typography variant="h6" style={{ fontWeight: 600 }}>
                                No Content Available:
                              </Typography>
                              <Box sx={styles.statusText}>
                                <Typography>
                                  The body content is empty or unavailable.
                                </Typography>
                                {displayStatusIcon(urlCheckResponse.bodyNotEmptyAssertion.passed)}
                              </Box>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </Box>
                  </>
                )}
            </>
          )}
      </Container>
    </>
  );
}

export default ChplUrlChecker;

ChplUrlChecker.propTypes = {
};
