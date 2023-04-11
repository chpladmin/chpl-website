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
  makeStyles,
} from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import { arrayOf } from 'prop-types';

import { palette, utilStyles } from 'themes';
import { ChplTooltip } from 'components/util';
import { measure as measureType } from 'shared/prop-types';
import { sortCriteria } from 'services/criteria.service';

const useStyles = makeStyles({
  ...utilStyles,
  infoIcon: {
    color: `${palette.primary}`,
  },
});

const getDisplayCriteria = (criteria) => [...new Set(criteria.map((c) => c.number))]
  .map((number) => ({ number, title: 'n/a' }))
  .sort(sortCriteria)
  .map((cc) => cc.number)
  .join('; ');

function ChplG1g2(props) {
  const { measures } = props;
  const classes = useStyles();

  if (!measures || measures.length === 0) {
    return (
      <Typography>
        No measures tested for G1/G2.
      </Typography>
    );
  }

  return (
    <Card>
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
              <TableRow key={measure.id}>
                <TableCell className={measure.measure.removed ? classes.removedText : ''}>
                  <Box display="flex" alignItems="center" gridGap={4}>
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
                        <IconButton>
                          <InfoIcon className={classes.infoIcon} />
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
