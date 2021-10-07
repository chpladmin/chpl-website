import React, { useState } from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';

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
  tableActionContainer: {
    display: 'grid',
    justifyContent: 'end',
  },
});

function ChplChangeRequestHistory(props) {
  /* eslint-disable react/destructuring-assignment */
  const DateUtil = getAngularService('DateUtil');
  const [changeRequests, setChangeRequests] = useState(props.changeRequests);
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
    setChangeRequests(changeRequests.sort(sortComparator(orderDirection + property)).map((cr) => cr));
  };

  return (
    <div className={classes.container}>
      <div className={classes.tableActionContainer}>
        <Button
          fullWidth
          color="secondary"
          variant="contained"
          onClick={() => props.dispatch('close')}
        >
          Close
        </Button>
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
            {changeRequests
              .map((cr) => (
                <TableRow key={cr.id}>
                  <TableCell>{cr.actingOrganization}</TableCell>
                  <TableCell>{DateUtil.timestampToString(cr.statusChangeDate)}</TableCell>
                  <TableCell>{cr.changeRequestStatusType.name}</TableCell>
                  <TableCell>{cr.comment}</TableCell>
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
  changeRequests: arrayOf(changeRequestProp).isRequired,
  dispatch: func.isRequired,
};
