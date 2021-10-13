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
  makeStyles,
} from '@material-ui/core';
import { arrayOf } from 'prop-types';
import VisibilityIcon from '@material-ui/icons/Visibility';
import Moment from 'react-moment';

import theme from '../../themes/theme';
import { getAngularService } from '../../services/angular-react-helper';
import {
  changeRequest as changeRequestProp,
  changeRequestStatusType,
} from '../../shared/prop-types';

import { useFetchChangeRequests } from '../../api/change-requests';

import {
  ChplAvatar,
  ChplPagination,
  ChplSortableHeaders,
} from '../util';

import ChplChangeRequestEdit from './change-request-edit';
import ChplChangeRequestView from './change-request-view';

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

const getChangeRequests = (query) => {
  if (!query.isSuccess) { return []; }
  return query.data
      .map((item) => ({
        ...item,
        developerName: item.developer.name,
        changeRequestTypeName: item.changeRequestType.name,
        currentStatusName: item.currentStatus.changeRequestStatusType.name,
        currentStatusChangeDate: item.currentStatus.statusChangeDate,
      }))
      .sort(sortComparator('-receivedDate'));
};


function ChplChangeRequests(props) {
  /* eslint-disable react/destructuring-assignment */
  const DateUtil = getAngularService('DateUtil');
  const [changeRequest, setChangeRequest] = useState(undefined);
  const [changeRequests, setChangeRequests] = useState([]);
  const [changeRequestStatusTypes, setChangeRequestStatusTypes] = useState([]);
  const [mode, setMode] = useState('view');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const changeRequestQuery = useFetchChangeRequests();
  const classes = useStyles();
  /* eslint-enable react/destructuring-assignment */

  useEffect(() => {
    setChangeRequests(getChangeRequests(changeRequestQuery));
  }, []);

  useEffect(() => {
    setChangeRequestStatusTypes(props.changeRequestStatusTypes.data
      .filter((item) => item.name !== 'Cancelled by Requester'));
  }, [props.changeRequestStatusTypes]); // eslint-disable-line react/destructuring-assignment

  const handleDispatch = (action, data) => {
    switch (action) {
      case 'close':
        setMode('view');
        setChangeRequest(undefined);
        break;
      case 'edit':
        setMode('edit');
        break;
        // no default
    }
    console.log({ action, data });
  };

  const handleTableSort = (event, property, orderDirection) => {
    setChangeRequests(changeRequests
      .map((item) => item)
      .sort(sortComparator(orderDirection + property)));
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, changeRequests.length - page * rowsPerPage);

  if (!changeRequests || changeRequests.length === 0) {
    return (
      <>No results found</>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      { changeRequest && mode === 'view'
        && (
        <ChplChangeRequestView
          changeRequest={changeRequest}
          dispatch={handleDispatch}
        />
        )}
      { changeRequest && mode === 'edit'
        && (
        <ChplChangeRequestEdit
          changeRequest={changeRequest}
          changeRequestStatusTypes={changeRequestStatusTypes}
          dispatch={handleDispatch}
        />
        )}
      { !changeRequest
        && (
        <>
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
                        {item.developerName}
                      </TableCell>
                      <TableCell>{item.changeRequestTypeName}</TableCell>
                      <TableCell>{DateUtil.getDisplayDateFormat(item.submittedDate)}</TableCell>
                      <TableCell>{item.currentStatusName}</TableCell>
                      <TableCell><Moment fromNow>{item.currentStatusChangeDate}</Moment></TableCell>
                      <TableCell align="right">
                        <Button
                          onClick={() => setChangeRequest(item)}
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
        </>
        )}
    </ThemeProvider>
  );
}

export default ChplChangeRequests;

ChplChangeRequests.propTypes = {
  changeRequestStatusTypes: arrayOf(changeRequestStatusType),
};

ChplChangeRequests.defaultProps = {
  changeRequestStatusTypes: {data: []},
};
