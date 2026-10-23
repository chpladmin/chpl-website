import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Skeleton,
  Typography,
} from '@mui/material';

import { useFetchReportMetadata } from 'api/reports';
import {
  ChplLoadingPage,
  ChplPageBody,
  ChplPageHeader,
  ChplSkeletonCard,
} from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { compareStrings } from 'services/sort.service';
import { useAnalyticsContext } from 'shared/contexts';
import { palette, theme } from 'themes';

const styles = {
  stickyCard: {
    position: 'sticky',
    top: '116px',
  },
  card: {
    width: '48%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease, all 0.2s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.02)',
    },
    [theme.breakpoints.down('lg')]: {
      width: '100%',
    },
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '32px !important',
    gap: theme.spacing(1),
  },
  cardButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  menuButton: {
    justifyContent: 'flex-start',
    color: palette.primary,
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: palette.greyLight,
      color: palette.primary,
    },
    '&:focus': {
      backgroundColor: palette.secondary,
      color: palette.primary,
    },
  },
  activeMenuButton: {
    backgroundColor: palette.secondary,
    color: palette.black,
    fontWeight: 'bold',
    '&:focus': {
      backgroundColor: palette.secondary,
      color: palette.black,
    },
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
};

// Same layout as ChplCharts with no report open: the report menu card beside
// the introduction card and its grid of report tiles
const loadingStyles = {
  layout: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '32px',
    width: '100%',
  },
  menu: {
    width: '350px',
    maxWidth: '35%',
    flexShrink: 0,
  },
  menuContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    padding: '16px',
  },
  introduction: {
    flex: 1,
  },
  introductionContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: '16px',
  },
  tiles: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '32px',
    marginTop: '32px',
    marginBottom: '16px',
  },
  tile: {
    width: '48%',
    [theme.breakpoints.down('lg')]: {
      width: '100%',
    },
  },
  tileContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    padding: '32px',
  },
};

const menuWidths = ['40%', '75%', '65%', '80%', '70%', '60%', '75%'];
const tileWidths = ['70%', '55%', '65%', '60%', '75%', '50%'];

function ChplChartsLoading() {
  return (
    <ChplLoadingPage label="Loading charts">
      <Box sx={loadingStyles.layout}>
        <ChplSkeletonCard sx={loadingStyles.menu}>
          <Box sx={loadingStyles.menuContent}>
            { menuWidths.map((width) => (
              <Skeleton key={width} variant="text" width={width} height={36} />
            ))}
          </Box>
        </ChplSkeletonCard>
        <ChplSkeletonCard sx={loadingStyles.introduction}>
          <Box sx={loadingStyles.introductionContent}>
            <Skeleton variant="text" width="25%" height={32} />
            <Skeleton variant="text" width="100%" height={22} />
            <Skeleton variant="text" width="95%" height={22} />
            <Skeleton variant="text" width="60%" height={22} />
            <Box sx={loadingStyles.tiles}>
              { tileWidths.map((width) => (
                <ChplSkeletonCard key={width} sx={loadingStyles.tile}>
                  <Box sx={loadingStyles.tileContent}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton variant="text" width={width} height={24} />
                  </Box>
                </ChplSkeletonCard>
              ))}
            </Box>
          </Box>
        </ChplSkeletonCard>
      </Box>
    </ChplLoadingPage>
  );
}

function ChplCharts() {
  const { analytics } = useAnalyticsContext();
  const [activeReport, setActiveReport] = useState(undefined);
  const [reportMetadata, setReportMetadata] = useState([]);
  const { data, isLoading, isSuccess } = useFetchReportMetadata();

  useEffect(() => {
    if (isLoading || !isSuccess) { return; }
    setReportMetadata(data);
  }, [data, isLoading, isSuccess]);

  const handleReportChange = (title) => {
    setActiveReport(reportMetadata.find((metadata) => metadata.title === title));
    eventTrack({
      ...analytics,
      category: 'Charts',
      event: `Navigate to ${reportMetadata.find((metadata) => metadata.title === title)?.title || 'Charts'}`,
    });
  };

  if (isLoading) {
    return <ChplChartsLoading />;
  }

  return (
    <>
      <ChplPageHeader text="Charts" />
      <ChplPageBody>
        <Box display="flex" alignItems="flex-start" flexDirection="row" gap="32px" width="100%">
          <Box maxWidth="350px">
            <Card sx={styles.stickyCard}>
              <CardContent>
                <Box sx={styles.cardButtons}>
                  <Button
                    color="primary"
                    sx={[styles.menuButton, activeReport === undefined && styles.activeMenuButton]}
                    onClick={() => handleReportChange(undefined)}
                    fullWidth
                    variant="text"
                  >
                    Charts
                  </Button>
                  { [...reportMetadata]
                    .sort((a, b) => compareStrings(a.title, b.title))
                    .map((report) => (
                      <Button
                        key={`${report.title}-button`}
                        color="primary"
                        sx={[styles.menuButton, activeReport?.title === report.title && styles.activeMenuButton]}
                        onClick={() => handleReportChange(report.title)}
                        id={`report-${report.title}`}
                        fullWidth
                        variant="text"
                      >
                        { report.title }
                      </Button>
                    ))}
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box width="100%">
            { !activeReport && (
              <Card>
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    <b>CHPL Charts</b>
                  </Typography>
                  <Typography gutterBottom>
                    A dynamic reporting suite powered by PowerBI, providing detailed insights and analytics derived from CHPL data. This tool offers interactive reports with robust click-through capabilities, allowing users to explore and analyze data seamlessly. Each report is designed to be user-friendly, enabling in-depth exploration of key metrics and trends, with the flexibility to dive deeper into the numbers that matter most.
                  </Typography>
                  <Box mt={8} mb={4} display="flex" flexDirection="row" flexWrap="wrap" gap="32px">
                    {reportMetadata && reportMetadata.map((report) => (
                      <Card
                        key={report.title}
                        sx={styles.card}
                        onClick={() => handleReportChange(report.title)}
                      >
                        <CardContent sx={styles.cardContent}>
                          {report.icon}
                          <Typography>{ report.title }</Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}
            { activeReport && (
              <Card
                sx={{ width: '100%' }}
                key={activeReport.title}
              >
                <CardContent sx={styles.reportCardContent}>
                  <Box
                    component="iframe"
                    title={activeReport.title}
                    sx={styles.iframe}
                    height={activeReport.height}
                    src={activeReport.url}
                    allowFullScreen
                  />
                </CardContent>
              </Card>
            )}
          </Box>
        </Box>
      </ChplPageBody>
    </>
  );
}

export default ChplCharts;
