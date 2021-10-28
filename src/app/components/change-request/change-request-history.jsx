import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
  Typography,
  Divider,
} from '@material-ui/core';

import { getAngularService } from '../../services/angular-react-helper';
import { changeRequest as changeRequestProp } from '../../shared/prop-types';
import ChplSortableHeaders from '../util/chpl-sortable-headers';

const useStyles = makeStyles({
  container: {
    display: 'grid',
    gap: '16px',
  },
  tableContainer: {
    border: '.5px solid #c2c6ca',
  },
});

function ChplChangeRequestHistory(props) {
  /* eslint-disable react/destructuring-assignment */
  const DateUtil = getAngularService('DateUtil');
  const [items, setItems] = useState(props.changeRequest.statuses);
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  const headers = [
    { text: 'Acting Organization', property: 'actingOrganization', sortable: true },
    { text: 'Date of Status Change', property: 'statusChangeDate', sortable: true },
    { text: 'Status', property: 'changeRequestStatusTypeName', sortable: true },
    { text: 'Comments', property: 'comment' },
  ];

  const sortComparator = (property) => {
    let sortOrder = 1;
    let key = property;
    if (key[0] === '-') {
      sortOrder = -1;
      key = key.substr(1);
    }
    return (a, b) => {
      const result = (a[key] < b[key]) ? -1 : 1;
      return result * sortOrder;
    };
  };

  const handleTableSort = (event, property, orderDirection) => {
    setItems(items.sort(sortComparator(orderDirection + property)).map((item) => item));
  };

  return (
    <div className={classes.container}>
      <div>
        <Typography variant='subtitle2'> Change Request History:</Typography>
      </div>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table stickyHeader>
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
            orderBy="statusChangeDate"
            order="desc"
          />
          <TableBody>
            {items
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.actingOrganization}</TableCell>
                  <TableCell>{DateUtil.timestampToString(item.statusChangeDate)}</TableCell>
                  <TableCell>{item.changeRequestStatusType.name}</TableCell>
                  <TableCell>{item.comment}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default ChplChangeRequestHistory;

ChplChangeRequestHistory.propTypes = {
  changeRequest: changeRequestProp.isRequired,
};
