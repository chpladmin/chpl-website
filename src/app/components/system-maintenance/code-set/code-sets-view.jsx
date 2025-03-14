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
  { property: 'startDay', text: 'Start Date', sortable: true },
  { property: 'requiredDay', text: 'Required Date', sortable: true },
  { text: 'Applicable Criteria' },
];

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplCodeSetsView({ codeSets: initialCodeSets }) {
  const [codeSets, setCodeSets] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const classes = useStyles();

  useEffect(() => {
    setCodeSets(initialCodeSets
      .map((item) => ({
        ...item,
        criteriaDisplay: item.criteria
          .sort(sortCriteria)
          .map((c) => `${c.status === 'REMOVED' ? 'Removed | ' : ''}${c.number}`)
          .join(', '),
      }))
      .sort(sortComparator('name')));
  }, [initialCodeSets]);

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = codeSets.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setCodeSets(updated);
  };

  return (
    <>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          aria-label="Code Set table"
        >
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
            orderBy={orderBy}
            order={order}
            stickyHeader
          />
          <TableBody>
            { codeSets
              .map((item) => (
                <TableRow key={`${item.id}`}>
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
