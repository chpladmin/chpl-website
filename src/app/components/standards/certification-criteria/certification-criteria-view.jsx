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
import { arrayOf } from 'prop-types';

import { ChplSortableHeaders, sortComparator } from 'components/util/sortable-headers';
import { isCures, sortCriteria } from 'services/criteria.service';
import { getDisplayDateFormat } from 'services/date-util';
import { criterion as criterionPropType } from 'shared/prop-types';

const headers = [
  { property: 'number', text: 'Number', sortable: true },
  { property: 'title', text: 'Title', sortable: true },
  { property: 'startDay', text: 'Start Date', sortable: true },
  { property: 'requiredDay', text: 'Required Date', sortable: true },
  { property: 'endDay', text: 'End Date', sortable: true },
  { text: 'Rule' },
];

const useStyles = makeStyles({
  firstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#fff',
  },
});

function ChplCertificationCriteriaView({ certificationCriteria: initialCertificationCriteria }) {
  const [certificationCriterias, setCertificationCriteria] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('value');
  const classes = useStyles();

  useEffect(() => {
    setCertificationCriteria(initialCertificationCriteria
      .map((item) => ({
        ...item,
      }))
      .sort(sortComparator('value')));
  }, [initialCertificationCriteria]); // eslint-disable-line react/destructuring-assignment

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = certificationCriterias.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setCertificationCriteria(updated);
  };

  return (
    <>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          aria-label="Certification Criteria table"
        >
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
            orderBy={orderBy}
            order={order}
            stickyHeader
          />
          <TableBody>
            { certificationCriterias
              .map((item) => (
                <TableRow key={`${item.id}`}>
                  <TableCell className={classes.firstColumn}>
                    { item.number }
                  </TableCell>
                  <TableCell>
                    { item.title }
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.startDay) }
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.requiredDay) }
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.endDay) }
                  </TableCell>
                  <TableCell>
                    { item.rule?.name ?? '' }
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ChplCertificationCriteriaView;

ChplCertificationCriteriaView.propTypes = {
  certificationCriteria: arrayOf(criterionPropType).isRequired,
};
