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

import { ChplLink } from 'components/util';
import { ChplSortableHeaders, sortComparator } from 'components/util/sortable-headers';
import { getDisplayDateFormat } from 'services/date-util';
import { cqm as cqmPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const headers = [
  { property: 'number', text: 'Number', sortable: true },
  { property: 'title', text: 'Title', sortable: true },
  { property: 'startDay', text: 'Start Date', sortable: true },
  { property: 'endDay', text: 'End Date', sortable: true },
  { text: 'Certification Companion Guide' },
  { text: 'Rule' },
  { text: 'Attributes' },
];

const useStyles = makeStyles({
  ...utilStyles,
});

function ChplCqmsView({ cqms: initialCqms }) {
  const [cqms, setCqms] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('value');
  const classes = useStyles();

  useEffect(() => {
    setCqms(initialCqms
      .sort(sortComparator('value')));
  }, [initialCqms]);

  const handleTableSort = (event, property, orderDirection) => {
    const descending = orderDirection === 'desc';
    const updated = cqms.sort(sortComparator(property, descending));
    setOrderBy(property);
    setOrder(orderDirection);
    setCqms(updated);
  };

  return (
    <>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          aria-label="CQM table"
        >
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
            orderBy={orderBy}
            order={order}
            stickyHeader
          />
          <TableBody>
            { cqms
              .map((item) => (
                <TableRow key={`${item.id}`}>
                  <TableCell className={classes.firstColumn}>
                    { item.removed
                      && (
                        <>
                          Removed |
                        </>
                      )}
                    { item.number }
                  </TableCell>
                  <TableCell>
                    { item.title }
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.startDay) }
                  </TableCell>
                  <TableCell>
                    { getDisplayDateFormat(item.endDay) }
                  </TableCell>
                  <TableCell>
                    { item.companionGuideLink
                      && (
                        <ChplLink
                          href={item.companionGuideLink}
                          text={item.companionGuideLink}
                          external={false}
                        />
                      )}
                    { !item.companionGuideLink
                      && (
                        'N/A'
                      )}
                  </TableCell>
                  <TableCell>
                    { item.rule?.name }
                  </TableCell>
                  <TableCell>
                    { item.displayAttributes.length > 0 ? item.displayAttributes : 'N/A' }
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default ChplCqmsView;

ChplCqmsView.propTypes = {
  cqms: arrayOf(cqmPropType).isRequired,
};
