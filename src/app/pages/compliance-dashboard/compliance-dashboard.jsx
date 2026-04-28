import React, { useEffect, useContext, useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
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
    height: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  reportCardContent: {
    padding: '0 !important',
    overflow: 'hidden',
    '&:last-child': {
      paddingBottom: '0 !important',
    },
  },
  iframe: {
    border: 'none',
    width: '100%',
    display: 'block',
    marginBottom: '-69px',
  },
  importantDatesIframe: {
    border: 'none',
    width: '100%',
    display: 'block',
    marginTop: '-48px',
    marginBottom: '-69px',
  },
});

function ChplComplianceDashboard() {
  const classes = useStyles();
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
  const [reportMetadata, setReportMetadata] = useState([]);
  const { data, isLoading, isSuccess } = useFetchReportMetadata('onc-dashboard');

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setReportMetadata(data || []);
  }, [data, isLoading, isSuccess]);

  const defaultHeights = {
    QuestionableUrls: 365,
    DeveloperAttestations: 600,
    ImportantDates: 450,
  };

  const leftColumnReports = [
    { title: 'Non-Conformity Counts', height: 365 },
    { title: 'Service Base URL', height: 365 },
    { title: 'Direct Review', height: 365 },
    { title: 'Surveillance Activities', height: 365 },
  ];

  const rightColumnReports = [
    { title: 'Real World Testing Summary', height: 600 },
    { title: 'Updated Criteria Status Report', height: 600 },
  ];

  useEffect(() => {
    eventTrack({
      ...analytics,
      category: 'Compliance Dashboard',
      event: 'View Dashboard',
    });
  }, [analytics]);

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

  const questionableUrlsReport = reportMetadata.find((r) => r.reportKey === 'QuestionableUrls');
  const attestationsReport = reportMetadata.find((r) => r.reportKey === 'DeveloperAttestations');
  const importantDatesReport = reportMetadata.find((r) => r.reportKey === 'ImportantDates');

  const questionableUrlsHeight = defaultHeights.QuestionableUrls;
  const attestationsHeight = defaultHeights.DeveloperAttestations;
  const importantDatesHeight = defaultHeights.ImportantDates;

  return (
    <>
      <Box bgcolor={palette.white} p={8}>
        <Container maxWidth="lg">
          <Typography variant="h1">Compliance Dashboard</Typography>
          <Typography variant="body1" color="textSecondary">
            A comprehensive view of compliance reports and metrics
          </Typography>
        </Container>
      </Box>
      <Box className={classes.container}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="flex-start">
            <Grid item xs={12} md={4}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Card className={classes.reportCard}>
                    <CardHeader title={importantDatesReport?.title || 'Important Dates'} />
                    <CardContent className={classes.reportCardContent}>
                      {isLoading ? (
                        <Skeleton variant="rect" height={importantDatesHeight} />
                      ) : importantDatesReport ? (
                        <iframe
                          title={importantDatesReport.title}
                          className={classes.importantDatesIframe}
                          height={importantDatesHeight}
                          src={importantDatesReport.url}
                        />
                      ) : (
                        <Typography variant="body1" color="textSecondary" align="center" style={{ padding: '32px' }}>
                          Report not available
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12}>
                  <Card className={classes.reportCard}>
                    <CardHeader title={questionableUrlsReport?.title || 'Questionable URLs'} />
                    <CardContent className={classes.reportCardContent}>
                      {isLoading ? (
                        <Skeleton variant="rect" height={questionableUrlsHeight} />
                      ) : questionableUrlsReport ? (
                        <iframe
                          title={questionableUrlsReport.title}
                          className={classes.iframe}
                          height={questionableUrlsHeight}
                          src={questionableUrlsReport.url}
                        />
                      ) : (
                        <Typography variant="body1" color="textSecondary" align="center" style={{ padding: '32px' }}>
                          Report not available
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                {leftColumnReports.map((report, index) => (
                  <Grid item xs={12} key={`left-${index}`}>
                    <Card className={classes.reportCard}>
                      <CardHeader title={report.title} />
                      <CardContent>
                        <Skeleton variant="rect" height={report.height} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Card className={classes.reportCard}>
                    <CardHeader title={attestationsReport?.title || 'Developer Attestations'} />
                    <CardContent className={classes.reportCardContent}>
                      {isLoading ? (
                        <Skeleton variant="rect" height={attestationsHeight} />
                      ) : attestationsReport ? (
                        <iframe
                          title={attestationsReport.title}
                          className={classes.iframe}
                          height={attestationsHeight}
                          src={attestationsReport.url}
                        />
                      ) : (
                        <Typography variant="body1" color="textSecondary" align="center" style={{ padding: '32px' }}>
                          Report not available
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
                {rightColumnReports.map((report, index) => (
                  <Grid item xs={12} key={`right-${index}`}>
                    <Card className={classes.reportCard}>
                      <CardHeader title={report.title} />
                      <CardContent>
                        <Skeleton variant="rect" height={report.height} />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default ChplComplianceDashboard;
