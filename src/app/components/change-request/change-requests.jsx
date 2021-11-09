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
import GetAppIcon from '@material-ui/icons/GetApp';
import Moment from 'react-moment';
import { object } from 'prop-types';
import { ExportToCsv } from 'export-to-csv';

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

const csvOptions = {
  showLabels: true,
  headers: [
    { headerName: 'Developer', objectKey: 'developerName' },
    { headerName: 'Request Type', objectKey: 'changeRequestTypeName' },
    { headerName: 'Creation Date', objectKey: 'friendlyReceivedDate' },
    { headerName: 'Request Status', objectKey: 'currentStatusName' },
    { headerName: 'Last Status Change', objectKey: 'friendlyCurrentStatusChangeDate' },
  ],
};

const useStyles = makeStyles(() => ({
  container: {
    maxHeight: '64vh',
  },
  iconSpacing: {
    marginLeft: '4px',
  },
  tableActionContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingBottom: '16px',
    gap: '8px',
  },
  tableFirstColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#ffffff',
  },
  tableDeveloperCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  developerName: {
    fontWeight: '600',
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
  const $scope = props.scope; // eslint-disable-line react/destructuring-assignment
  const csvExporter = new ExportToCsv(csvOptions);
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
        friendlyReceivedDate: DateUtil.timestampToString(item.submittedDate),
        friendlyCurrentStatusChangeDate: DateUtil.timestampToString(item.currentStatus.statusChangeDate),
      }))
      .sort(sortComparator(comparator));
  };

  const getChangeRequestStatusTypes = () => {
    if (!changeRequestStatusTypesQuery.isSuccess) { return []; }
    return changeRequestStatusTypesQuery.data.data.filter((type) => {
      if (hasAnyRole(['ROLE_DEVELOPER'])) {
        return type.name === 'Pending ONC-ACB Action' || type.name === 'Cancelled by Requester';
      }
      return type.name !== 'Pending ONC-ACB Action' && type.name !== 'Cancelled by Requester';
    })
      .sort((a, b) => (a.name < b.name ? -1 : 1));
  };

  const save = (data) => {
    updateChangeRequest.mutate(data, {
      onSuccess: () => {
        setMode('view');
        setChangeRequest(undefined);
      },
      onError: (error) => {
        if (error.response.data.error?.startsWith('Email could not be sent to')) {
          toaster.pop({
            type: 'info',
            title: 'Notice',
            body: `${error.response.data.error} However, the changes have been applied`,
          });
          setMode('view');
          setChangeRequest(undefined);
        } else {
          const body = error.response.data?.error
                || error.response.data?.errorMessages.join(' ');
          toaster.pop({
            type: 'error',
            title: 'Error',
            body,
          });
        }
        $scope.$apply();
      },
    });
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
            <div className={classes.tableActionContainer} component={Paper}>
              <div>
                <Button color="secondary" variant="contained" onClick={() => csvExporter.generateCsv(getChangeRequests())}>
                  Download Requests
                  <GetAppIcon className={classes.iconSpacing} />
                </Button>
              </div>
            </div>
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
                           <TableCell className={classes.tableFirstColumn}>
                             <div className={classes.tableDeveloperCell}>
                               <div>
                                 <ChplAvatar
                                   text={item.developerName}
                                 />
                               </div>
                               <div className={classes.developerName}>
                                 <a href={`#/organizations/developers/${item.developer.developerId}`}>
                                   {item.developerName}
                                 </a>
                               </div>
                             </div>
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
              rowsPerPageOptions={[10, 50, 100, 250]}
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
  scope: object.isRequired, // eslint-disable-line react/forbid-prop-types
};
