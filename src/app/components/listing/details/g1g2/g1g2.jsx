import React from 'react';
import {
  Box,
  Card,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { arrayOf } from 'prop-types';

import { ChplTooltip } from 'components/util';
import { sortCriteria } from 'services/criteria.service';
import { measure as measureType } from 'shared/prop-types';
import { palette, utilStyles } from 'themes';

const styles = {
  ...utilStyles,
  infoIcon: {
    color: `${palette.primary}`,
  },
  tableScrolling: {
    overflowX: 'auto !important',
  },
};

const getDisplayCriteria = (criteria) => [...new Set(criteria.map((c) => c.number))]
  .map((number) => ({ number, title: 'n/a' }))
  .sort(sortCriteria)
  .map((cc) => cc.number)
  .join('; ');

function ChplG1g2(props) {
  const { measures } = props;

  if (!measures || measures.length === 0) {
    return (
      <Typography>
        No measures tested for G1/G2.
      </Typography>
    );
  }

  return (
    <Card sx={styles.tableScrolling}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Measure Name</TableCell>
            <TableCell>Required Test</TableCell>
            <TableCell>G1/G2?</TableCell>
            <TableCell>Associated Criteria</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { measures
            .map((measure) => (
              <TableRow key={measure.id ?? measure.measure.id}>
                <TableCell sx={[measure.measure.removed && styles.removedText]}>
                  <Box display="flex" alignItems="center" gap="4px">
                    { measure.measure.removed
                    && (
                      <>
                        Removed |
                        {' '}
                      </>
                    )}
                    { measure.measure.name }
                    { measure.measure.removed
                    && (
                      <ChplTooltip title="This MACRA Measure has been removed from the Program.">
                        <IconButton size="large">
                          <InfoIcon sx={styles.infoIcon} />
                        </IconButton>
                      </ChplTooltip>
                    )}
                  </Box>
                </TableCell>
                <TableCell>
                  { measure.measure.requiredTest}
                </TableCell>
                <TableCell>
                  { measure.measureType.name}
                </TableCell>
                <TableCell>
                  { getDisplayCriteria(measure.associatedCriteria) }
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </Card>
  );
}

export default ChplG1g2;

ChplG1g2.propTypes = {
  measures: arrayOf(measureType).isRequired,
};
