import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Container,
  Button,
  makeStyles,
} from '@material-ui/core';

import { useFetchReportMetadata } from 'api/reports';
import { ChplLink } from 'components/util';
import { useAnalyticsContext } from 'shared/contexts';
import { palette, theme } from 'themes';

const useStyles = makeStyles({
  container: {
    height: '1200px',
    padding: theme.spacing(8),
    backgroundColor: palette.greyLight,
  },
  stickyCard: {
    position: 'sticky',
    top: '116px',
  },
  card: {
    width: '46%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease, all 0.2s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  cardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px !important',
    gap: theme.spacing(1),
  },
  cardButtons: {
    display: 'flex',
    flexDirection: 'column',
  },
});

function ChplCharts() {
  const [activeReport, setActiveReport] = useState(undefined);
  const [productMetadata, setProductMetadata] = useState(undefined);
  const [ncMetadata, setNcMetadata] = useState(undefined);
  const productQuery = useFetchReportMetadata('UniqueProducts');
  const ncQuery = useFetchReportMetadata('Non-conformityCounts');
  const analytics = {
    ...useAnalyticsContext().analytics,
    category: 'Charts',
  };
  const classes = useStyles();

  useEffect(() => {
    if (productQuery.isLoading || !productQuery.isSuccess) { return; }
    setProductMetadata(productQuery.data);
    setActiveReport(productQuery.data);
  }, [productQuery.data, productQuery.isLoading, productQuery.isSuccess]);

  useEffect(() => {
    if (ncQuery.isLoading || !ncQuery.isSuccess) { return; }
    setNcMetadata(ncQuery.data);
  }, [ncQuery.data, ncQuery.isLoading, ncQuery.isSuccess]);

  const handleReportChange = (report) => {
    setActiveReport(report);
  };

  if (!productMetadata || !ncMetadata) {
    return <CircularProgress />;
  }

  const getNavigationButton = (report) => (
    <Button
      key={`${report.reportKey}-button`}
      style={{ justifyContent: 'flex-start' }}
      color="primary"
      onClick={() => handleReportChange(report)}
    >
      { report.title }
    </Button>
  );

  return (
    <>
      <Box bgcolor={palette.white} p={8}>
        <Container maxWidth="lg">
          <Typography variant="h1">Charts</Typography>
        </Container>
      </Box>
      <Box className={classes.container}>
        <Container maxWidth="lg">
          <Box display="flex" flexDirection="row" gridGap={32} width="100%">
            <Box maxWidth="350px">
              <Card className={classes.stickyCard}>
                <CardContent>
                  <Box className={classes.cardButtons}>
                    { getNavigationButton(productMetadata) }
                    { getNavigationButton(ncMetadata) }
                  </Box>
                </CardContent>
              </Card>
            </Box>
            <Box width="100%">
              <Card
                style={{ width: '100%' }}
              >
                <CardContent>
                  <Typography>
                    The charts are a dynamic display of the data currently on the CHPL. If there are any questions or comments regarding this feature, please submit them through the
                    {' '}
                    <ChplLink
                      href="https://inquiry.healthit.gov/support/plugins/servlet/loginfreeRedirMain?portalid=2&request=51"
                      text="Health IT Feedback and Inquiry Portal"
                      analytics={{
                        ...analytics,
                        event: 'Go to CHPL Public User Guide',
                      }}
                      external={false}
                      inline
                    />
                  </Typography>
                  <iframe
                    title={activeReport.title}
                    width="100%"
                    height={activeReport.height}
                    src={activeReport.url}
                    frameBorder="0"
                    allowFullScreen
                  />
                  { activeReport.reportKey === 'UniqueProducts'
                    && (
                      <Typography>
                        Please note only certification criteria certified to by a unique product are displayed.
                      </Typography>
                    )}
                  { activeReport.reportKey === 'Non-conformityCounts'
                    && (
                      <Typography>
                        Please note only certification criteria and program requirements for which a non-conformity has been recorded are displayed.
                      </Typography>
                    )}
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default ChplCharts;
