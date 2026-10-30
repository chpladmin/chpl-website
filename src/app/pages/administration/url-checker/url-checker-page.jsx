import React, { useContext, useState } from 'react';
import {
  Box, Card, CardContent, Typography,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import ChplUrlChecker from 'components/url-checker/url-checker';
import { ChplLink } from 'components/util';
import { UserContext } from 'shared/contexts';
import { utilStyles, theme } from 'themes';

const styles = {
  ...utilStyles,
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

function ChplUrlCheckerPage() {
  const { hasAnyRole } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [urlCheckResponse, setUrlCheckResponse] = useState(undefined);

  const displayStatusIcon = (passed) => (passed ? (
    <CheckCircleIcon fontSize="large" sx={styles.greenIcon} />
  ) : (
    <CancelIcon fontSize="large" sx={styles.redIcon} />
  ));

  const handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'loading':
        setIsLoading(true);
        setUrlCheckResponse(undefined);
        break;
      case 'complete':
        setIsLoading(false);
        setUrlCheckResponse(payload);
        break;
        // no default
    }
  };

  return (
    <>
      <ChplUrlChecker
        dispatch={handleDispatch}
        showResultPopover={false}
      />
        { isLoading
          && (
            <>
              <Typography sx={styles.titlePadding} component="h2" variant="h5" style={{ fontWeight: 600 }}>Results</Typography>
              <Box sx={styles.resultsContainer}>
                <Card sx={styles.resultsCardHalf}>
                  <CardContent>
                    <Skeleton variant="text" width="40%" height={36} />
                    <Skeleton variant="text" width="55%" height={36} />
                    <Skeleton variant="text" width="35%" height={28} />
                    <Skeleton variant="text" width="90%" height={28} />
                  </CardContent>
                </Card>
                <Card sx={styles.resultsCardHalf}>
                  <CardContent>
                    <Skeleton variant="text" width="30%" height={36} />
                    <Skeleton variant="text" width="95%" height={28} />
                  </CardContent>
                </Card>
              </Box>
            </>
          )}
        { urlCheckResponse
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
    </>
  );
}

export default ChplUrlCheckerPage;

ChplUrlCheckerPage.propTypes = {
};
