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
import { getDisplayDateFormat } from 'services/date-util';
import { utilStyles } from 'themes';

const headers = [
  { property: 'name', text: 'Name', sortable: true },
  { property: 'removalDate', text: 'Removal Date' },
  { text: 'Applicable Criteria' },
];

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplConformanceMethodsView({ conformanceMethods: initialConformanceMethods }) {
  const [conformanceMethods, setConformanceMethods] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const classes = useStyles();

  useEffect(() => {
    setConformanceMethods(initialConformanceMethods
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => c.number)
          .join(', '),
      }))
      .sort(sortComparator('name')));
  }, [initialConformanceMethods]);

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = conformanceMethods.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setConformanceMethods(updated);
  };

  return (
    <>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          aria-label="Conformance Method table"
        >
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
            orderBy={orderBy}
            order={order}
            stickyHeader
          />
          <TableBody>
            { conformanceMethods
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
                    { getDisplayDateFormat(item.removalDate) }
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

export default ChplConformanceMethodsView;

ChplConformanceMethodsView.propTypes = {
  conformanceMethods: arrayOf(object).isRequired,
};
