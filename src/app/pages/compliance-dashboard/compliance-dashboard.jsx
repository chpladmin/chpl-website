import React, { useEffect, useState } from 'react';
import {
  Box, Card, CardContent, CardHeader, Grid,
} from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

import { useFetchReportMetadata } from 'api/reports';

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

function ChplComplianceDashboard() {
  const [reportMetadata, setReportMetadata] = useState([]);
  const { data, isLoading, isSuccess } = useFetchReportMetadata('onc-dashboard');

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setReportMetadata(data);
  }, [data, isLoading, isSuccess]);

  const buildCard = (report) => {
    const displayData = reportMetadata.find((r) => r.title === report.title) ?? {
      isLoading: true,
      title: `Not yet implemented - ${report.title}`,
      height: report.isWide ? 600 : 400,
    };

    return (
      <Grid item xs={12} key={report.title}>
        <Card sx={styles.reportCard}>
          <CardHeader title={displayData.title} />
          <CardContent sx={styles.reportCardContent}>
            { displayData.isLoading ? (
              <Skeleton variant="rectangular" height={displayData.height} />
            ) : (
              <Box
                component="iframe"
                title={displayData.title}
                sx={[styles.iframe, report.uniqueClass && styles[report.uniqueClass]]}
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
    <Grid container sx={{ width: `calc(100% + 64px)` }} spacing={2} alignItems="flex-start">
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
