import React from 'react';
import {
  Box, Card, CardContent, Divider, Typography,
} from '@mui/material';
import {
  func,
  object,
} from 'prop-types';

import { ChplActionBar, useActionBar } from 'components/action-bar';
import { theme, utilStyles } from 'themes';

const styles = {
  ...utilStyles,
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: '16px',
    marginBottom: '32px',
    [theme.breakpoints.up('md')]: {
      display: 'grid',
      gridTemplateColumns: '350px 1fr',
      alignItems: 'start',
    },
  },
  reportInfoCard: {
    padding: '8px',
  },
  responseBox: {
    padding: '16px',
    backgroundColor: '#eee',
    border: '1px solid #afafaf',
    borderRadius: '4px',
  },
  stickyColumn: {
    position: 'sticky',
    top: '124px',
    zIndex: 1,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0 4px 8px',
  },
  summaryGroup: {
    margin: '8px 0',
    whiteSpace: 'pre-line',
  },
};

function ChplAnnualView({
  dispatch,
  report,
}) {
  useActionBar({
    canCancel: false,
    canClose: true,
    canSave: false,
  });

  const handleDispatch = (action) => {
    dispatch({ action });
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.stickyColumn}>
        <Card sx={styles.reportInfoCard}>
          <CardContent>
            <Typography variant="h6" component="h2">
              <strong>{`${report.acb?.name} Annual Surveillance Reporting`}</strong>
            </Typography>
            <Typography variant="body1">
              { report.year }
            </Typography>
          </CardContent>
        </Card>
      </Box>
      <Card>
        <CardContent>
          <Box>
            <Typography variant="h6" component="h2">
              <strong>Obstacle Summary</strong>
            </Typography>
            <Typography style={{ paddingBottom: '4px', color: '#373737' }} variant="body2" gutterBottom>
              Please list any obstacles encountered during surveillance, including those related to resources/technical capabilities, developers, and providers/end-users.
            </Typography>
            <Typography sx={styles.responseBox}>
              { report.obstacleSummary }
            </Typography>
          </Box>
          <Box sx={styles.summaryGroup}>
            <Typography variant="h6" component="h2">
              <strong>Priority Changes From Findings Summary</strong>
            </Typography>
          </Box>
          <Typography sx={styles.responseBox}>
            { report.priorityChangesFromFindingsSummary }
          </Typography>
          <Divider />
          <Typography variant="body2">
            The titles and descriptions used in this module&apos;s user interface reflect the most recent version of the report and may appear differently for historical reports in the downloads
          </Typography>
        </CardContent>
      </Card>
      <ChplActionBar dispatch={handleDispatch} />
    </Box>
  );
}

export default ChplAnnualView;

ChplAnnualView.propTypes = {
  dispatch: func.isRequired,
  report: object.isRequired,
};
