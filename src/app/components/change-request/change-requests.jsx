import React, { useContext, useState } from 'react';
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
import VisibilityIcon from '@material-ui/icons/Visibility';
import Moment from 'react-moment';
import { object } from 'prop-types';

import theme from '../../themes/theme';
import { getAngularService } from '../../services/angular-react-helper';
import {
  useFetchChangeRequests,
  useFetchChangeRequestStatusTypes,
  usePutChangeRequest,
} from '../../api/change-requests';
import {
  ChplAvatar,
  ChplPagination,
  ChplSortableHeaders,
} from '../util';
import { UserContext } from '../../shared/contexts';

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
  const $scope = props.scope;
  const DateUtil = getAngularService('DateUtil');
  const toaster = getAngularService('toaster');
  const { hasAnyRole } = useContext(UserContext);
  const [changeRequest, setChangeRequest] = useState(undefined);
  const [comparator, setComparator] = useState('currentStatusChangeDate');
  const [mode, setMode] = useState('view');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const changeRequestQuery = useFetchChangeRequests();
  const changeRequestStatusTypesQuery = useFetchChangeRequestStatusTypes();
  const updateChangeRequest = usePutChangeRequest();
  const classes = useStyles();

  /* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
  const headers = hasAnyRole(['ROLE_DEVELOPER']) ? [
    { property: 'changeRequestTypeName', text: 'Request Type', sortable: true },
    { property: 'currentStatusName', text: 'Request Status', sortable: true },
    { property: 'currentStatusChangeDate', text: 'Time Since Last Status Change', sortable: true },
    { property: 'actions', text: 'Actions', invisible: true, sortable: false },
  ] : [
    { property: 'developerName', text: 'Developer', sortable: true },
    { property: 'changeRequestTypeName', text: 'Request Type', sortable: true },
    { property: 'receivedDate', text: 'Creation Date', sortable: true },
    { property: 'currentStatusName', text: 'Request Status', sortable: true },
    { property: 'currentStatusChangeDate', text: 'Time Since Last Status Change', sortable: true },
    { property: 'actions', text: 'Actions', invisible: true, sortable: false },
  ];

  const getChangeRequests = () => {
    if (!changeRequestQuery.isSuccess) { return []; }
    return changeRequestQuery.data
      .map((item) => ({
        ...item,
        developerName: item.developer.name,
        changeRequestTypeName: item.changeRequestType.name,
        currentStatusName: item.currentStatus.changeRequestStatusType.name,
        currentStatusChangeDate: item.currentStatus.statusChangeDate,
      }))
      .sort(sortComparator(comparator));
  };

  const getChangeRequestStatusTypes = () => {
    if (!changeRequestStatusTypesQuery.isSuccess) { return []; }
    return changeRequestStatusTypesQuery.data.data;
  };

  const handleDispatch = (action, data) => {
    switch (action) {
      case 'close':
        setMode('view');
        setChangeRequest(undefined);
        break;
      case 'edit':
        setMode('edit');
        break;
      case 'save':
        save(data);
        break;
        // no default
    }
  };

  const handleTableSort = (event, property, orderDirection) => {
    setComparator(orderDirection + property);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, getChangeRequests().length - page * rowsPerPage);

  const save = (data) => {
    console.log('saving', changeRequest, data);
    updateChangeRequest.mutate(data, {
      onSuccess: () => {
        setMode('view');
        setChangeRequest(undefined);
      },
      onError: (error) => {
        console.log('error', error.response.data.error);
        toaster.pop({
          type: 'error',
          title: 'Error',
          body: error.response.data.error,
        });
        console.log($scope);
        $scope.$apply();
      },
    });
  };

  if (getChangeRequests().length === 0) {
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
            changeRequestStatusTypes={getChangeRequestStatusTypes()}
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
                  orderBy="currentStatusChangeDate"
                  order="asc"
                />
                <TableBody>
                  {getChangeRequests()
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <TableRow key={item.id}>
                        { !hasAnyRole(['ROLE_DEVELOPER'])
                         && (
                         <TableCell>
                           <ChplAvatar
                             text={item.developerName}
                           />
                           {item.developerName}
                         </TableCell>
                         )}
                        <TableCell>{item.changeRequestTypeName}</TableCell>
                        { !hasAnyRole(['ROLE_DEVELOPER'])
                         && <TableCell>{DateUtil.getDisplayDateFormat(item.submittedDate)}</TableCell>}
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
                  {emptyRows > 0 && false && (
                    <TableRow style={{ height: 33 * emptyRows }}>
                      <TableCell colSpan={headers.length} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <ChplPagination
              count={getChangeRequests().length}
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
  scope: object,
};
