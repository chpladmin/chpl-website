import React, { useState } from 'react';
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

import { getAngularService } from '../../services/angular-react-helper';
import { changeRequest } from '../../shared/prop-types';
import ChplSortableHeaders  from '../util/chpl-sortable-headers';

const useStyles = makeStyles({
  tableContainer: {
    border:'.5px solid #c2c6ca',
  },
});

function ChplChangeRequestHistory(props) {
  const DateUtil = getAngularService('DateUtil');
  const [changeRequests, setChangeRequests] = useState(props.changeRequests);
  const classes = useStyles();

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
    <div>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table stickyHeader>
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
            orderBy="statusChangeDate"
          />
          <TableBody>
            {changeRequests
             .map((changeRequest) => (
               <TableRow key={changeRequest.id}>
                 <TableCell>{changeRequest.actingOrganization}</TableCell>
                 <TableCell>{DateUtil.timestampToString(changeRequest.statusChangeDate)}</TableCell>
                 <TableCell>{changeRequest.changeRequestStatusType.name}</TableCell>
                 <TableCell>{changeRequest.comment}</TableCell>
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
  changeRequests: arrayOf(changeRequest).isRequired,
}
