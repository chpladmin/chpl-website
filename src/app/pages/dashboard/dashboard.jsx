import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  makeStyles,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import { useFetchReportMetadata } from 'api/reports';
import { eventTrack } from 'services/analytics.service';
import { useAnalyticsContext } from 'shared/contexts';
import { UserContext } from 'shared/contexts';
import { palette, theme } from 'themes';

const useStyles = makeStyles({
  container: {
    padding: theme.spacing(8),
    backgroundColor: palette.greyLight,
    minHeight: 'calc(100vh - 238px)',
  },
  reportCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  reportCardContent: {
    padding: '0 !important',
    height: '100%',
    '&:last-child': {
      paddingBottom: '0 !important',
    },
  },
  iframe: {
    border: 'none',
    width: '100%',
  },
});

function ChplDashboard() {
  const classes = useStyles();
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
  const [reportMetadata, setReportMetadata] = useState([]);
  const { data, isLoading, isSuccess } = useFetchReportMetadata('astp-dashboard');

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setReportMetadata(data);
  }, [data, isLoading, isSuccess]);

  useEffect(() => {
    eventTrack({
      ...analytics,
      category: 'ASTP Dashboard',
      event: 'View Dashboard',
    });
  }, [analytics]);

  // Check if user has required role
  if (!hasAnyRole(['chpl-admin'])) {
    return (
      <Box bgcolor={palette.white} p={8}>
        <Container maxWidth="lg">
          <Typography variant="h1">Access Denied</Typography>
          <Typography variant="body1">
            You do not have permission to view this page.
          </Typography>
        </Container>
      </Box>
    );
  }

  return (
    <>
      <Box bgcolor={palette.white} p={8}>
        <Container maxWidth="lg">
          <Typography variant="h1">ASTP Compliance Dashboard</Typography>
          <Typography variant="body1" color="textSecondary">
            A comprehensive view of ASTP compliance reports and metrics
          </Typography>
        </Container>
      </Box>
      <Box className={classes.container}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {/* Skeleton placeholders for future reports */}
            <Grid item xs={12} md={6}>
              <Card className={classes.reportCard}>
                {isLoading && (
                  <CardContent>
                    <Skeleton variant="rect" height={400} />
                  </CardContent>
                )}
                {!isLoading && reportMetadata.length > 0 && reportMetadata[0] && (
                  <CardContent className={classes.reportCardContent}>
                    <iframe
                      title={reportMetadata[0].title}
                      className={classes.iframe}
                      height={reportMetadata[0].height || 400}
                      src={reportMetadata[0].url}
                    />
                  </CardContent>
                )}
                {!isLoading && reportMetadata.length === 0 && (
                  <CardContent>
                    <Skeleton variant="rect" height={400} />
                    <Box mt={2}>
                      <Typography variant="body2" color="textSecondary" align="center">
                        Report will be available soon
                      </Typography>
                    </Box>
                  </CardContent>
                )}
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card className={classes.reportCard}>
                {isLoading && (
                  <CardContent>
                    <Skeleton variant="rect" height={400} />
                  </CardContent>
                )}
                {!isLoading && reportMetadata.length > 1 && reportMetadata[1] && (
                  <CardContent className={classes.reportCardContent}>
                    <iframe
                      title={reportMetadata[1].title}
                      className={classes.iframe}
                      height={reportMetadata[1].height || 400}
                      src={reportMetadata[1].url}
                    />
                  </CardContent>
                )}
                {!isLoading && reportMetadata.length < 2 && (
                  <CardContent>
                    <Skeleton variant="rect" height={400} />
                    <Box mt={2}>
                      <Typography variant="body2" color="textSecondary" align="center">
                        Report will be available soon
                      </Typography>
                    </Box>
                  </CardContent>
                )}
              </Card>
            </Grid>

            {/* Skeleton placeholders for additional future reports */}
            {[...Array(4)].map((_, index) => (
              <Grid item xs={12} md={6} key={`skeleton-${index}`}>
                <Card className={classes.reportCard}>
                  <CardContent>
                    <Skeleton variant="rect" height={400} />
                    <Box mt={2}>
                      <Typography variant="body2" color="textSecondary" align="center">
                        Additional report placeholder
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default ChplDashboard;
