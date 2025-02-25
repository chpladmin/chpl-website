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
  { property: 'abbreviation', text: 'Abbreviation', sortable: true },
  { property: 'domainDisplay', text: 'Domain', sortable: true },
  { property: 'requiredTest', text: 'Required Test', sortable: true },
  { property: 'name', text: 'Name', sortable: true },
  { text: 'Applicable Criteria' },
];

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplG1g2View({ g1g2: initialG1g2 }) {
  const [g1g2, setG1g2] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('abbreviation');
  const classes = useStyles();

  useEffect(() => {
    setG1g2(initialG1g2
      .map((item) => ({
        ...item,
        domainDisplay: item.domain.name,
        criteriaDisplay: item.allowedCriteria
          .sort(sortCriteria)
          .map((c) => c.number)
          .join(', '),
      }))
      .sort(sortComparator('abbreviation')));
  }, [initialG1g2]);

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = g1g2.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setG1g2(updated);
  };

  return (
    <>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          aria-label="G1/G2 Measure table"
        >
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
            orderBy={orderBy}
            order={order}
            stickyHeader
          />
          <TableBody>
            { g1g2
              .map((item) => (
                <TableRow key={`${item.id}`}>
                  <TableCell className={classes.firstColumn}>
                    { item.abbreviation }
                  </TableCell>
                  <TableCell>
                    { item.domainDisplay }
                  </TableCell>
                  <TableCell>
                    { item.removed
                      && (
                        <>
                          Removed |
                        </>
                      )}
                    { item.requiredTest }
                  </TableCell>
                  <TableCell>
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

export default ChplG1g2View;

ChplG1g2View.propTypes = {
  g1g2: arrayOf(object).isRequired,
};
