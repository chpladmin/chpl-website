import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { useFetchReportMetadata } from 'api/reports';
import { ChplPageBody, ChplPageHeader, ChplSkeletonCard } from 'components/util';
import { utilStyles } from 'themes';

const styles = {
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
  unavailable: {
    padding: '16px',
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
};

const reports = [{
  title: 'Important Dates',
  uniqueClass: 'lessTopMargin',
}, {
  title: 'Questionable URLs',
}, {
  title: 'Questionable Activity',
}, {
  title: 'Real World Testing',
}, {
  title: 'Surveillance Non-conformities',
}, {
  title: 'Developer Attestations',
  isWide: true,
}, {
  title: 'Service Base URL List',
  isWide: true,
}, {
  title: 'Updated Criteria Status',
  isWide: true,
}, {
  title: 'Direct Review Activities',
  isWide: true,
}, {
  title: 'Surveillance Activities',
  isWide: true,
}];

// Report heights before the metadata gives the real ones
const defaultHeight = (report) => (report.isWide ? 600 : 400);

const loadingStyles = {
  header: {
    padding: '16px',
  },
};

// The dashboard's grid of report cards: the narrow column beside the wide one,
// each card its report's usual height under a title
function ChplComplianceDashboardLoading() {
  const buildCard = (report) => (
    <Grid item xs={12} key={report.title}>
      <ChplSkeletonCard>
        <Box sx={loadingStyles.header}>
          <Skeleton variant="text" width="60%" height={32} />
        </Box>
        <Box height={defaultHeight(report)} />
      </ChplSkeletonCard>
    </Grid>
  );

  return (
    <Box role="status" aria-live="polite">
      <Box component="span" sx={utilStyles.visuallyHidden}>Loading compliance reports</Box>
      <Grid container sx={{ width: 'calc(100% + 64px)' }} spacing={2} alignItems="flex-start" aria-hidden="true">
        <Grid item xs={12} md={4}>
          <Grid sx={{ paddingLeft: '0px' }} container spacing={4}>
            { reports.filter((r) => !r.isWide).map((report) => buildCard(report)) }
          </Grid>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={4}>
            { reports.filter((r) => r.isWide).map((report) => buildCard(report)) }
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

function ChplComplianceDashboard() {
  const { data, isLoading, isSuccess } = useFetchReportMetadata('onc-dashboard');

  if (isLoading) {
    return (
      <>
        <ChplPageHeader
          text="Compliance Dashboard"
          subtitle="A comprehensive view of compliance reports and metrics"
        />
        <ChplPageBody>
          <ChplComplianceDashboardLoading />
        </ChplPageBody>
      </>
    );
  }

  const reportMetadata = isSuccess ? data : [];

  const buildCard = (report) => {
    const displayData = reportMetadata.find((r) => r.title === report.title);

    return (
      <Grid item xs={12} key={report.title}>
        <Card sx={styles.reportCard}>
          <CardHeader title={report.title} />
          <CardContent sx={styles.reportCardContent}>
            { displayData ? (
              <Box
                component="iframe"
                title={displayData.title}
                sx={[styles.iframe, report.uniqueClass && styles[report.uniqueClass]]}
                height={displayData.height}
                src={displayData.url}
              />
            ) : (
              <Typography sx={styles.unavailable}>This report is not available</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <>
      <ChplPageHeader
        text="Compliance Dashboard"
        subtitle="A comprehensive view of compliance reports and metrics"
      />
      <ChplPageBody>
        <Grid container sx={{ width: 'calc(100% + 64px)' }} spacing={2} alignItems="flex-start">
          <Grid item xs={12} md={4}>
            <Grid sx={{ paddingLeft: '0px' }} container spacing={4}>
              { reports.filter((r) => !r.isWide).map((report) => buildCard(report)) }
            </Grid>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              { reports.filter((r) => r.isWide).map((report) => buildCard(report)) }
            </Grid>
          </Grid>
        </Grid>
      </ChplPageBody>
    </>
  );
}

export default ChplComplianceDashboard;
