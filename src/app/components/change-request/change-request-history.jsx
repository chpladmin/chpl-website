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

import ChplSortableHeaders from '../util/chpl-sortable-headers';

import { getAngularService } from 'services/angular-react-helper';
import { changeRequest as changeRequestProp } from 'shared/prop-types';

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
  const DateUtil = getAngularService('DateUtil');
  const [items, setItems] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    setItems(props.changeRequest.statuses.map((item) => {
      const updated = {
        ...item,
      };
      switch (item.userPermission.authority) {
        case 'ROLE_ADMIN':
        case 'ROLE_ONC':
          updated.actingOrganization = 'ONC';
          break;
        case 'ROLE_ACB':
          updated.actingOrganization = item.certificationBody.name;
          break;
        case 'ROLE_DEVELOPER':
          updated.actingOrganization = props.changeRequest.developer.name;
          break;
          // no default
      }
      return updated;
    }).sort((a, b) => b.statusChangeDate - a.statusChangeDate));
  }, [props.changeRequest.developer.name, props.changeRequest.statuses]); // eslint-disable-line react/destructuring-assignment

  const headers = [
    { text: 'Acting Organization', property: 'actingOrganization' },
    { text: 'Date of Status Change', property: 'statusChangeDate' },
    { text: 'Status', property: 'changeRequestStatusTypeName' },
    { text: 'Comments', property: 'comment' },
  ];

  return (
    <div className={classes.container}>
      <div>
        <Typography variant="subtitle2"> Change Request History</Typography>
      </div>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table stickyHeader>
          <ChplSortableHeaders
            headers={headers}
            onTableSort={() => {}}
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
