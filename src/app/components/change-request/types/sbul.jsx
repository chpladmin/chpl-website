import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { usePostChangeRequest } from 'api/change-requests';
import usePostUrlChecker from 'api/url-checker';
import { ChplActionBar } from 'components/action-bar';
import { ChplLink, ChplTextField } from 'components/util';
import { ListingContext, UserContext } from 'shared/contexts';
import { utilStyles, palette, theme } from 'themes';

const useStyles = makeStyles({
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
});

const validationSchema = yup.object({
  url: yup.string()
    .required('Field is required')
    .url('Improper format (http://www.example.com)'),
});

function ChplSbul() {
  const { hasAnyRole } = useContext(UserContext);
  const { listing, setSbulChange } = useContext(ListingContext);
  const { enqueueSnackbar } = useSnackbar();
  const { mutate: submitCR } = usePostChangeRequest();
  const {
    data, isLoading, isSuccess, mutate,
  } = usePostUrlChecker();
  const [currentUrl, setCurrentUrl] = useState(undefined);
  const [errorMessages, setErrorMessages] = useState([]);
  const [hasValidated, setHasValidated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [urlCheckResponse, setUrlCheckResponse] = useState(undefined);
  const classes = useStyles();
  let formik;

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setUrlCheckResponse(data.data);
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    const url = listing.certificationResults.find((cr) => cr.criterion.id === 182)?.serviceBaseUrlList;
    formik.setFieldValue('url', url);
    setCurrentUrl(url);
  }, [listing]);

  const handleDispatch = (action) => {
    switch (action) {
      case 'cancel':
        setSbulChange(false);
        break;
      case 'save':
        setIsProcessing(true);
        submitCR({
          developer: listing.developer,
          details: {
            listing,
            url: formik.values.url,
            changeRequestListingUrlType: {
              id: 1,
            },
          },
        }, {
          onSuccess: () => {
            setIsProcessing(false);
            enqueueSnackbar('URL change request has been submitted successfully.', {
              variant: 'success',
            });
            setSbulChange(false);
          },
          onError: (error) => {
            setIsProcessing(false);
            if (error.response.data.error) {
              setErrorMessages([error.response.data.error]);
            } else if (error.response.data.errorMessages) {
              setErrorMessages(error.response.data.errorMessages);
            } else {
              setErrorMessages(['An error occurred. Please try again, or contact your ONC-ACB for assistance']);
            }
          },
        });
        break;
        // no default
    }
  };

  const isActionDisabled = () => !formik.isValid || !hasValidated || formik.values.url === currentUrl;

  const validate = (urlToValidate) => {
    setUrlCheckResponse(undefined);
    mutate(urlToValidate, {
      onSuccess: () => {
        setHasValidated(true);
      },
      onError: () => {
        setHasValidated(true);
        enqueueSnackbar('There was an error attempting to check the URL.', {
          variant: 'error',
        });
      },
    });
  };

  formik = useFormik({
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
        <CheckCircleIcon fontSize="large" className={classes.greenIcon} />
      );
    }
    return (
      <CancelIcon fontSize="large" className={classes.redIcon} />
    );
  };

  return (
    <>
      <Box className={classes.titleBackground}>
        <Container maxWidth="lg">
          <Typography className={classes.titlePadding} variant="h1">Service Base URL List Update</Typography>
          <Typography>
            Current URL:
            {' '}
            { currentUrl ?? 'None' }
          </Typography>
          <Box display="flex" alignItems="flex-start">
            <ChplTextField
              id="url"
              name="url"
              label="New URL"
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
        { isLoading
          && (
            <Box py={4}>
              <CircularProgress />
            </Box>
          )}
        {urlCheckResponse
          && (
            <>
              <Typography className={classes.titlePadding} component="h2" variant="h5" style={{ fontWeight: 600 }}>Results</Typography>
              <Box className={classes.resultsContainer}>
                <Card className={classes.resultsCardHalf}>
                  <CardContent>
                    <Typography variant="h6" style={{ fontWeight: 600 }}>
                      Status:
                    </Typography>
                    <Typography variant="h6" className={classes.statusText}>
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
                <Card className={classes.resultsCardHalf}>
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
                    <Typography className={classes.titlePadding} component="h3" variant="h6" style={{ fontWeight: 600 }}>Assertions</Typography>
                    <Box className={classes.resultsContainer}>
                      <Card className={classes.resultsCard}>
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
                              <Box className={classes.statusText}>
                                <Typography>
                                  The HTTP response code could not be retrieved or is unavailable.
                                </Typography>
                                {displayStatusIcon(urlCheckResponse.httpResponseAssertion.passed)}
                              </Box>
                            </>
                          )}
                        </CardContent>
                      </Card>
                      <Card className={classes.resultsCard}>
                        <CardContent>
                          <Typography variant="h6" style={{ fontWeight: 600 }}>
                            Response Time (in milliseconds):
                          </Typography>
                          {urlCheckResponse.responseTimeAssertion?.actualValue
                            ? (
                              <>
                                <Box className={classes.statusText}>
                                  <Typography>
                                    {urlCheckResponse.responseTimeAssertion.actualValue}
                                  </Typography>
                                  {displayStatusIcon(urlCheckResponse.responseTimeAssertion.passed)}
                                </Box>
                              </>
                            ) : (
                              <>
                                <Box className={classes.statusText}>
                                  <Typography>
                                    The response time is empty or unavailable.
                                  </Typography>
                                  {displayStatusIcon(urlCheckResponse.responseTimeAssertion.passed)}
                                </Box>
                              </>
                            )}
                        </CardContent>
                      </Card>
                      <Card className={classes.resultsCard}>
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
                                {displayStatusIcon(urlCheckResponse.bodyNotEmptyAssertion.passed)}
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
        <ChplActionBar
          dispatch={handleDispatch}
          isDisabled={isActionDisabled()}
          isProcessing={isProcessing}
          errors={errorMessages}
        />
      </Container>
    </>
  );
}

export default ChplSbul;

ChplSbul.propTypes = {
};
