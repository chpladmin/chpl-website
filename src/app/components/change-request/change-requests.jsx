import React, { useEffect, useState } from 'react';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  ThemeProvider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, func } from 'prop-types';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Moment from 'react-moment';

import theme from '../../themes/theme';
import {
  ChplAvatar,
  ChplEllipsis,
  ChplPagination,
  ChplSortableHeaders,
} from '../util';
import { getAngularService } from '../../services/angular-react-helper';
import { changeRequest as changeRequestProp } from '../../shared/prop-types';

const useStyles = makeStyles(() => ({
  container: {
    maxHeight: '64vh',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
}));

/* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
const headers = [
  { property: 'developerName', text: 'Developer', sortable: true },
  { property: 'changeRequestTypeName', text: 'Request Type', sortable: true },
  { property: 'receivedDate', text: 'Creation Date', sortable: true },
  { property: 'currentStatusName', text: 'Request Status', sortable: true },
  { property: 'currentStatusChangeDate', text: 'Time Since Last Status Change', sortable: true },
  { property: 'actions', text: 'Actions', invisible: true, sortable: false },
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

function ChplChangeRequests(props) {
  /* eslint-disable react/destructuring-assignment */
  const [changeRequests, setChangeRequests] = useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const DateUtil = getAngularService('DateUtil');
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    setChangeRequests(props.changeRequests
      .map((item) => ({
        ...item,
        developerName: item.developer.name,
        changeRequestTypeName: item.changeRequestType.name,
        currentStatusName: item.currentStatus.changeRequestStatusType.name,
        currentStatusChangeDate: item.currentStatus.statusChangeDate,
      }))
      .sort(sortComparator('-receivedDate')));
  }, [props.changeRequests]); // eslint-disable-line react/destructuring-assignment

  const handleTableSort = (event, property, orderDirection) => {
    setChangeRequests(changeRequests
      .map((item) => item)
      .sort(sortComparator(orderDirection + property)));
  };

  const handleAction = (action, data) => {
    props.dispatch(action, data);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, changeRequests.length - page * rowsPerPage);

  if (!changeRequests || changeRequests.length === 0) {
    return (
      <>No results found</>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <TableContainer className={classes.container} component={Paper}>
        <Table
          stickyHeader
          aria-label="Change Requests table"
        >
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
            orderBy="receivedDate"
            order="desc"
          />
          <TableBody>
            {changeRequests
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <ChplAvatar
                      className={classes.developerAvatar}
                      text={item.developerName}
                    />
                  {item.developerName}</TableCell>
                  <TableCell>{item.changeRequestTypeName}</TableCell>
                  <TableCell>{DateUtil.getDisplayDateFormat(item.submittedDate)}</TableCell>
                  <TableCell>{item.currentStatusName}</TableCell>
                  <TableCell><Moment fromNow>{item.currentStatusChangeDate}</Moment></TableCell>
                  <TableCell align="right">
                    <Button
                      onClick={() => handleAction('view', item)}
                      variant="contained"
                      color="primary"
                    >
                      View
                      {' '}
                      <VisibilityIcon className={classes.iconSpacing} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow style={{ height: 33 * emptyRows }}>
                <TableCell colSpan={headers.length} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <ChplPagination
        count={changeRequests.length}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[2, 10, 50, 100, 250]}
        setPage={setPage}
        setRowsPerPage={setRowsPerPage}
      />
    </ThemeProvider>
  );
}

export default ChplChangeRequests;

ChplChangeRequests.propTypes = {
  changeRequests: arrayOf(changeRequestProp).isRequired,
  dispatch: func.isRequired,
};
