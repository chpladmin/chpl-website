import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

import { useFetchReportMetadata } from 'api/reports';
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
  lessTopMargin: {
    marginTop: '-48px',
  },
});

const reports = [{
  reportKey: 'ImportantDates',
  uniqueClass: 'lessTopMargin',
}, {
  reportKey: 'Nonconformities',
}, {
  reportKey: 'QuestionableUrls',
}, {
  reportKey: 'RealWorldTesting',
}, {
  reportKey: 'DirectReviews',
}, {
  reportKey: 'SurveillanceActivities',
}, {
  reportKey: 'DeveloperAttestations',
  isWide: true,
}, {
  reportKey: 'ServiceBaseUrlList',
  isWide: true,
}, {
  reportKey: 'UpdatedCriteriaStatus',
  isWide: true,
}];

function ChplComplianceDashboard() {
  const classes = useStyles();
  const [reportMetadata, setReportMetadata] = useState([]);
  const { data, isLoading, isSuccess } = useFetchReportMetadata('onc-dashboard');

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setReportMetadata(data);
  }, [data, isLoading, isSuccess]);

  const buildCard = (report) => {
    const displayData = reportMetadata.find((r) => r.reportKey === report.reportKey) ?? {
      isLoading: true,
      title: `Not yet implemented - ${report.reportKey}`,
      height: report.isWide ? 600 : 400,
    };

    return (
      <Grid item xs={12} key={report.reportKey}>
        <Card className={classes.reportCard}>
          <CardHeader title={displayData.title} />
          <CardContent className={classes.reportCardContent}>
            {displayData.isLoading ? (
              <Skeleton variant="rect" height={displayData.height} />
            ) : (
              <iframe
                title={displayData.title}
                className={`${classes.iframe} ${report.uniqueClass ? classes[report.uniqueClass] : ''}`}
                height={displayData.height}
                src={displayData.url}
              />
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  };

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
                { reports.filter((r) => !r.isWide).map((report) => buildCard(report)) }
              </Grid>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={4}>
                { reports.filter((r) => r.isWide).map((report) => buildCard(report)) }
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default ChplComplianceDashboard;
