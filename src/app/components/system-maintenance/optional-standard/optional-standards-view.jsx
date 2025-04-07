import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, object } from 'prop-types';

import { ChplSortableHeaders, sortComparator } from 'components/util/sortable-headers';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { sortCriteria } from 'services/criteria.service';
import { utilStyles } from 'themes';

const headers = [
  { property: 'displayValue', text: 'Display Value', sortable: true },
  { text: 'Citation' },
  { text: 'Description' },
  { text: 'Applicable Criteria' },
];

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplOptionalStandardsView({ optionalStandards: initialOptionalStandards }) {
  const [optionalStandards, setOptionalStandards] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('displayValue');
  const filterContext = useFilterContext();
  const classes = useStyles();

  useEffect(() => {
    setOptionalStandards(initialOptionalStandards
      .filter((item) => filterContext.filters.reduce((acc, f) => f.filterFn(item, f) && acc, true))
      .filter((item) => filterContext.searchTermFilter(filterContext.searchTerm, [
        item.displayValue,
        item.citation,
        item.description,
      ]))
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      }))
      .sort(sortComparator('displayValue')));
  }, [initialOptionalStandards, filterContext.filters, filterContext.searchTerm]);

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = optionalStandards.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setOptionalStandards(updated);
  };

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Display Value, Citation, or Description..."
      />
      <div>
        <ChplFilterChips />
      </div>
      <Typography variant="body2">
        {`(${optionalStandards.length} Result${optionalStandards.length !== 1 ? 's' : ''})`}
      </Typography>
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
