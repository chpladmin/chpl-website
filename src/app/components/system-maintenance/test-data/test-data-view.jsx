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
import { utilStyles } from 'themes';

const headers = [
  { property: 'name', text: 'Name', sortable: true },
  { property: 'description', text: 'Description', sortable: true },
  { text: 'Applicable Criteria' },
];

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplTestDataView({ testData: initialTestData }) {
  const [testData, setTestData] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const classes = useStyles();

  useEffect(() => {
    setTestData(initialTestData
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria.number,
      }))
      .sort(sortComparator('name')));
  }, [initialTestData]);

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = testData.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setTestData(updated);
  };

  return (
    <>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          aria-label="Test Data table"
        >
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
            orderBy={orderBy}
            order={order}
            stickyHeader
          />
          <TableBody>
            { testData
              .map((item) => (
                <TableRow key={`${item.id}`}>
                  <TableCell className={classes.firstColumn}>
                    { item.removed
                      && (
                        <>
                          Removed |
                        </>
                      )}
                    { item.name }
                  </TableCell>
                  <TableCell>
                    { item.description }
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
