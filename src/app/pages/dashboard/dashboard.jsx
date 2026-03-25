import React, { useEffect, useContext } from 'react';
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
    marginBottom: '-69px', // Hide PowerBI zoom controls at bottom
  },
});

function ChplDashboard() {
  const classes = useStyles();
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);

  const reports = [
    {
      title: 'Questionable URLs',
      url: 'https://app.powerbi.com/view?r=eyJrIjoiZGUwYjk5NzYtYzI2NS00MWU1LTgyYzEtOGI0ZjdjODU3ODM2IiwidCI6IjMwN2QyMTJhLWZiODYtNDgwNy04NGRkLTg2Nzc2OWI4MDQyYSIsImMiOjF9&navContentPaneEnabled=false&filterPaneEnabled=false',
      height: 365,
    },
    {
      title: 'Developer Attestations',
      url: 'https://app.powerbi.com/view?r=eyJrIjoiZTcxYTAzMzgtOTFhYi00YTRhLThjZjItZGY3ZmQwYzYzMDlhIiwidCI6IjMwN2QyMTJhLWZiODYtNDgwNy04NGRkLTg2Nzc2OWI4MDQyYSIsImMiOjF9&navContentPaneEnabled=false&filterPaneEnabled=false',
      height: 600,
    },
  ];

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
      category: 'ASTP Dashboard',
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

  return (
    <>
      <Box bgcolor={palette.white} p={8}>
        <Container maxWidth="lg">
          <Typography variant="h1">Compliance Dashboard</Typography>
          <Typography variant="body1" color="textSecondary">
            A comprehensive view of ASTP compliance reports and metrics
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
                    <CardHeader title={reports[0].title} />
                    <CardContent className={classes.reportCardContent}>
                      <iframe
                        title={reports[0].title}
                        className={classes.iframe}
                        height={reports[0].height}
                        src={reports[0].url}
                      />
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
                    <CardHeader title={reports[1].title} />
                    <CardContent className={classes.reportCardContent}>
                      <iframe
                        title={reports[1].title}
                        className={classes.iframe}
                        height={reports[1].height}
                        src={reports[1].url}
                      />
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

export default ChplDashboard;
