import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import {
  func,
  object,
} from 'prop-types';

import { ChplActionBar } from 'components/action-bar';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles({
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
    top: 124,
    zIndex: 1,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0 4px 8px',
  },
  summaryGroup: {
    margin: '8px 0',
    whiteSpace: 'pre-line',
  },
});

function ChplAnnualView({
  dispatch,
  report,
}) {
  const classes = useStyles();

  const handleDispatch = (action) => {
    dispatch({ action });
  };

  return (
    <div className={classes.container}>
      <Box className={classes.stickyColumn}>
        <Card className={classes.reportInfoCard}>
          <CardContent>
            <Typography variant="h6" component="h2"><strong>{`${report.acb?.name} Annual Surveillance Reporting`}</strong></Typography>
            <Typography variant="body1">{report.year}</Typography>
          </CardContent>
        </Card>
      </Box>
      <Card>
        <CardContent>
          <Box>
            <Typography style={{ fontWeight: 'bold' }} variant="h6" component="h2">
              Obstacle Summary
            </Typography>
            <Typography style={{ paddingBottom: '4px', color: '#373737' }} variant="body2" gutterbottom>
              Please list any obstacles encountered during surveillance, including those related to resources/technical capabilities, developers, and providers/end-users.
            </Typography>
            <Typography className={report.obstacleSummary ? classes.responseBox : ''}>
              {report.obstacleSummary}
            </Typography>
          </Box>
          <Box className={classes.summaryGroup}>
            <Typography style={{ fontWeight: 'bold' }} variant="h6" component="h2">
              Priority Changes From Findings Summary
            </Typography>
          </Box>
          <Typography className={classes.responseBox}>
            {report.priorityChangesFromFindingsSummary}
          </Typography>
          <Divider />
          <Typography variant="body2">
            The titles and descriptions used in this module&apos;s user interface reflect the most recent version of the report and may appear differently for historical reports in the downloads
          </Typography>
        </CardContent>
      </Card>

      <ChplActionBar
        canCancel={false}
        canClose
        canSave={false}
        dispatch={handleDispatch}
      />
    </div>
  );
}

export default ChplAnnualView;

ChplAnnualView.propTypes = {
  dispatch: func.isRequired,
  report: object.isRequired,
};
