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
  { property: 'displayValue', text: 'Display Value', sortable: true },
  { property: 'citation', text: 'Citation' },
  { property: 'description', text: 'Description' },
  { text: 'Applicable Criteria' },
];

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplOptionalStandardsView({ optionalStandards: initialOptionalStandards }) {
  const [optionalStandards, setOptionalStandards] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('displayValue');
  const classes = useStyles();

  useEffect(() => {
    setOptionalStandards(initialOptionalStandards
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => c.number)
          .join(', '),
      }))
      .sort(sortComparator('displayValue')));
  }, [initialOptionalStandards]);

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = optionalStandards.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setOptionalStandards(updated);
  };

  return (
    <>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          aria-label="Optional Standards table"
        >
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
            orderBy={orderBy}
            order={order}
            stickyHeader
          />
          <TableBody>
            { optionalStandards
              .map((item) => (
                <TableRow key={`${item.id}`}>
                  <TableCell className={classes.firstColumn}>
                    { item.displayValue }
                  </TableCell>
                  <TableCell>
                    { item.citation }
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

export default ChplOptionalStandardsView;

ChplOptionalStandardsView.propTypes = {
  optionalStandards: arrayOf(object).isRequired,
};
