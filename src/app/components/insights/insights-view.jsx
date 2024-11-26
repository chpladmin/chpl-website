import React, { useContext } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
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

import { UserContext } from 'shared/contexts';
import { developer as developerPropType } from 'shared/prop-types';

const useStyles = makeStyles({
  content: {
    display: 'grid',
    gap: '16px',
  },
});

function ChplInsightsView({ developer }) {
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
        { hasAnyRole(['chpl-developer']) && hasAuthorityOn({ id: developer.id }) && (
          <Typography variant="body1">
            Submit Insights at
            {' '}
            <a href="test">The Insights Reporting System</a>
            .
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default ChplInsightsView;

ChplInsightsView.propTypes = {
  developer: developerPropType.isRequired,
};
