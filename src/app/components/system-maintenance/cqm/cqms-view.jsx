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
import { cqm as cqmPropType } from 'shared/prop-types';
import { utilStyles } from 'themes';

const headers = [
  { property: 'display', text: 'ID', sortable: true },
  { property: 'title', text: 'Title', sortable: true },
  { property: 'description', text: 'Description', sortable: true },
  { property: 'domain', text: 'Domain', sortable: true },
  { text: 'Version(s)' },
];

const useStyles = makeStyles({
  ...utilStyles,
});

const sortVersion = (a, b) => {
  const aNum = parseInt(a.substring(1), 10);
  const bNum = parseInt(b.substring(1), 10);
  return aNum - bNum;
};

function ChplCqmsView({ cqms: initialCqms }) {
  const [cqms, setCqms] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('value');
  const classes = useStyles();

  useEffect(() => {
    setCqms(initialCqms
      .map((c) => ({
        ...c,
        display: c.cmsId ? c.cmsId : `NQF-${c.nqfNumber}`,
        versionDisplay: c.versions.sort(sortVersion).join(', '),
      }))
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
                <TableRow key={`${item.display}`}>
                  <TableCell style={{ minWidth: '175px' }} className={classes.firstColumn}>
                    { item.display }
                  </TableCell>
                  <TableCell style={{ minWidth: '150px' }}>
                    { item.title }
                  </TableCell>
                  <TableCell style={{ minWidth: '150px' }}>
                    { item.description }
                  </TableCell>
                  <TableCell style={{ minWidth: '150px' }}>
                    { item.domain }
                  </TableCell>
                  <TableCell style={{ minWidth: '150px' }}>
                    { item.versionDisplay }
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
