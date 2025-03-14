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

import { ChplSortableHeaders, sortComparator } from 'components/util/sortable-headers';
import { sortCriteria } from 'services/criteria.service';
import { utilStyles } from 'themes';

const headers = [
  { text: 'Name' },
  { text: 'Applicable Criteria' },
];

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplTestDataView({ testData: initialTestData }) {
  const [testData, setTestData] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setTestData(initialTestData
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      }))
      .sort(sortComparator('name')));
  }, [initialTestData]);

  return (
    <>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          aria-label="Test Data table"
        >
          <ChplSortableHeaders
            headers={headers}
            stickyHeader
          />
          <TableBody>
            { testData
              .map((item) => (
                <TableRow key={`${item.id}`}>
                  <TableCell className={classes.firstColumn}>
                    { item.name }
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

export default ChplTestDataView;

ChplTestDataView.propTypes = {
  testData: arrayOf(object).isRequired,
};
