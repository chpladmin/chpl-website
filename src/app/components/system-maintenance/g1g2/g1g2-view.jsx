import React, { useEffect, useState } from 'react';
import {
  Box,
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
  { property: 'abbreviation', text: 'Abbreviation', sortable: true },
  { property: 'domainDisplay', text: 'Domain', sortable: true },
  { property: 'requiredTest', text: 'Required Test' },
  { property: 'name', text: 'Name', sortable: true },
  { text: 'Applicable Criteria' },
];

const useStyles = makeStyles({
  ...utilStyles,
    tableResultsHeaderContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 32px',
  },
});

function ChplG1g2View({ g1g2: initialG1g2 }) {
  const [g1g2, setG1g2] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('abbreviation');
  const filterContext = useFilterContext();
  const classes = useStyles();

  useEffect(() => {
    setG1g2(initialG1g2
      .filter((item) => filterContext.filters.reduce((acc, f) => f.filterFn(item, f) && acc, true))
      .filter((item) => filterContext.searchTermFilter(filterContext.searchTerm, [
        item.abbreviation,
        item.domain.name,
        item.requiredTest,
        item.name,
      ]))
      .map((item) => ({
        ...item,
        domainDisplay: item.domain.name,
        criteriaDisplay: item.allowedCriteria
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      }))
      .sort(sortComparator('abbreviation')));
  }, [initialG1g2, filterContext.filters, filterContext.searchTerm]);

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = g1g2.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setG1g2(updated);
  };

  return (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Abbreviation, Domain, Required Test, or Name..."
      />
      <div>
        <ChplFilterChips />
      </div>
      <div className={classes.tableResultsHeaderContainer}>
        <Box display="flex" flexDirection="row" gridGap={1}>
        <Typography variant="subtitle2">Search Results:</Typography>
        <Typography variant="body2">
        {`(${g1g2.length} Result${g1g2.length !== 1 ? 's' : ''})`}
        </Typography>
        </Box>
      </div>
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
