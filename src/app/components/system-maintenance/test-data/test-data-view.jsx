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
  widerColumn: {
    minWidth: '200px',
  },
});

function ChplTestDataView(props) {
  const [testData, setTestData] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setTestData(props.testData
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      }))
      .sort(sortComparator('name')));
  }, [props.testData]);

  return (
    <>
      <TableContainer className={classes.container} component={Paper} style={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}>
        <Table
          aria-label="Test Data table"
        >
          <ChplSortableHeaders
            headers={headers}
            stickyHeader={props.stickyHeader}
          />
          <TableBody>
            { testData
              .map((item) => (
                <TableRow key={`${item.id}`}>
                  <TableCell className={`${classes.firstColumn} ${classes.widerColumn}`}>
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
