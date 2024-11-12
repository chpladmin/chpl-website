import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { ChplDialogTitle } from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext, useAnalyticsContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '16px',
  },
});

function ChplInsightsView({ developer }) {
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole, hasAuthorityOn } = useContext(UserContext);
  const classes = useStyles();

  return (
    <Card>
      <CardHeader title="Access Insights" />
      <CardContent className={classes.content}>
        <Typography variant="body1">
          Insights information is displayed here. For more information, please visit the
          {' '}
          <a href="https://www.healthit.gov/sites/default/files/2022-08/Attestations-Condition-Resource-Guide.pdf">Insights Guide</a>
          .
        </Typography>
        <TableContainer component={Paper}>
          <Table
            aria-label="Developer Insights information"
          >
            <TableHead>
              <TableRow>
                <TableCell>Insights Period</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>15 July 2027 to 15 July 2028</TableCell>
                <TableCell>Submitted</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>15 July 2026 to 15 July 2027</TableCell>
                <TableCell>Submitted</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body1">
          Submit Insights at
          {' '}
          <a href="test">The Insights Reporting System</a>
          .
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ChplInsightsView;

ChplInsightsView.propTypes = {
  developer: developerPropType.isRequired,
};
