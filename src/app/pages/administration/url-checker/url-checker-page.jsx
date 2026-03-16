import React, { useContext, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

import ChplUrlChecker from 'components/url-checker/url-checker';
import { ChplLink } from 'components/util';
import { UserContext } from 'shared/contexts';
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

function ChplUrlCheckerPage() {
  const { hasAnyRole } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [urlCheckResponse, setUrlCheckResponse] = useState(undefined);
  const classes = useStyles();

  const displayStatusIcon = (passed) => (passed ? (
    <CheckCircleIcon fontSize="large" className={classes.greenIcon} />
  ) : (
    <CancelIcon fontSize="large" className={classes.redIcon} />
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
      <Box className={classes.titleBackground}>
        <Container maxWidth="lg">
          <Typography className={classes.titlePadding} variant="h1">URL Checker</Typography>
          <Typography className={classes.titlePadding} variant="h5" component="h2" style={{ fontWeight: 600 }}>Validate a URL</Typography>
          <ChplUrlChecker
            dispatch={handleDispatch}
            showResultPopover={false}
          />
        </Container>
      </Box>
      <Container className={classes.pageBackground} maxWidth="lg">
        { isLoading
          && (
            <>
              <Typography className={classes.titlePadding} component="h2" variant="h5" style={{ fontWeight: 600 }}>Results</Typography>
              <Box className={classes.resultsContainer}>
                <Card className={classes.resultsCardHalf}>
                  <CardContent>
                    <Skeleton variant="text" width="40%" height={36} />
                    <Skeleton variant="text" width="55%" height={36} />
                    <Skeleton variant="text" width="35%" height={28} />
                    <Skeleton variant="text" width="90%" height={28} />
                  </CardContent>
                </Card>
                <Card className={classes.resultsCardHalf}>
                  <CardContent>
                    <Skeleton variant="text" width="30%" height={36} />
                    <Skeleton variant="text" width="95%" height={28} />
                  </CardContent>
                </Card>
              </Box>
              <Typography className={classes.titlePadding} component="h3" variant="h6" style={{ fontWeight: 600 }}>Assertions</Typography>
              <Box className={classes.resultsContainer}>
                <Card className={classes.resultsCard}>
                  <CardContent>
                    <Skeleton variant="text" width="70%" height={36} />
                    <Skeleton variant="text" width="45%" height={28} />
                    <Skeleton variant="text" width="90%" height={24} />
                  </CardContent>
                </Card>
                <Card className={classes.resultsCard}>
                  <CardContent>
                    <Skeleton variant="text" width="85%" height={36} />
                    <Skeleton variant="text" width="40%" height={28} />
                    <Skeleton variant="text" width="65%" height={24} />
                  </CardContent>
                </Card>
                <Card className={classes.resultsCard}>
                  <CardContent>
                    <Skeleton variant="text" width="55%" height={36} />
                    <Skeleton variant="text" width="90%" height={28} />
                    <Skeleton variant="text" width="80%" height={24} />
                  </CardContent>
                </Card>
              </Box>
            </>
          )}
        { urlCheckResponse
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
      </Container>
    </>
  );
}

export default ChplUrlCheckerPage;

ChplUrlCheckerPage.propTypes = {
};
