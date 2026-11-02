import React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Typography,
} from '@mui/material';

import { useFetchReportMetadata } from 'api/reports';
import { ChplPowerBiReport, ChplSkeletonCard } from 'components/util';
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
  skeleton: {
    height: '100%',
  },
  lessTopMargin: {
    marginTop: '-48px',
  },
};

const reports = [{
  title: 'Important Dates',
  uniqueClass: 'lessTopMargin',
}, {
  title: 'Direct Review Non-conformities',
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
  title: 'Surveillance Activities',
  isWide: true,
}];

// The height of a report's skeleton before the metadata gives the real one
const defaultHeight = (report) => (report.isWide ? 600 : 400);

function ChplComplianceDashboard() {
  const { data, isLoading, isSuccess } = useFetchReportMetadata('onc-dashboard');

  const reportMetadata = isSuccess ? data : [];

  const buildCard = (report) => {
    const displayData = reportMetadata.find((r) => r.title === report.title);

    return (
      <Grid item xs={12} key={report.title}>
        <Card sx={styles.reportCard}>
          <CardHeader title={report.title} />
          <CardContent sx={styles.reportCardContent}>
            { isLoading && (
              <Box height={defaultHeight(report)} aria-hidden="true">
                <ChplSkeletonCard sx={styles.skeleton} />
              </Box>
            )}
            { !isLoading && displayData && (
              <ChplPowerBiReport
                title={displayData.title}
                sx={[styles.iframe, report.uniqueClass && styles[report.uniqueClass]]}
                height={displayData.height}
                url={displayData.url}
                announce={false}
              />
            )}
            { !isLoading && !displayData && (
              <Typography sx={styles.unavailable}>This report is not available</Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Grid container sx={{ width: 'calc(100% + 64px)' }} spacing={2} alignItems="flex-start">
      { isLoading
        && (
          <Box component="span" sx={utilStyles.visuallyHidden} role="status" aria-live="polite">Loading compliance reports</Box>
        )}
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
  );
}

export default ChplComplianceDashboard;
