import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, object } from 'prop-types';

import { ChplSortableHeaders } from 'components/util/sortable-headers';
import { sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { utilStyles } from 'themes';

const headers = [
  { text: 'CHPL Entry Value' },
  { text: 'Start Date' },
  { text: 'Required Date' },
  { text: 'Applicable Criteria' },
];

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplCodeSetsView({ codeSets: initialCodeSets }) {
  const [codeSets, setCodeSets] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setCodeSets(initialCodeSets
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      })));
  }, [initialCodeSets]);

  return (
    <>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          aria-label="Code Set table"
        >
          <ChplSortableHeaders
            headers={headers}
            stickyHeader
          />
          <TableBody>
            { codeSets
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell className={classes.firstColumn}>
                    { item.name }
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.startDay) }
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.requiredDay) }
                  </TableCell>
                  <TableCell>
                    { item.criteriaDisplay }
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ChplCodeSetsView;

ChplCodeSetsView.propTypes = {
  codeSets: arrayOf(object).isRequired,
};
