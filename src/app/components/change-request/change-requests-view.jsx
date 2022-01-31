import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
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
import VisibilityIcon from '@material-ui/icons/Visibility';
import GetAppIcon from '@material-ui/icons/GetApp';
import Moment from 'react-moment';
import { arrayOf, func, object, string } from 'prop-types';
import { ExportToCsv } from 'export-to-csv';

import ChplChangeRequestEdit from './change-request-edit';
import ChplChangeRequestView from './change-request-view';

import {
  useFetchChangeRequests,
  useFetchChangeRequestStatusTypes,
  usePutChangeRequest,
} from 'api/change-requests';
import {
  ChplFilterChips,
  ChplFilterPanel,
  ChplFilterSearchTerm,
  useFilterContext,
} from 'components/filter';
import {
  ChplAvatar,
  ChplPagination,
  ChplSortableHeaders,
} from 'components/util';
import { getAngularService } from 'services/angular-react-helper';
import { UserContext } from 'shared/contexts';
import theme from 'themes/theme';

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
  searchContainer: {
    backgroundColor: '#c6d5e5',
    padding: '16px 32px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'auto 10fr auto',
    },
  },
  tableResultsHeaderContainer: {
    display: 'grid',
    gap: '8px',
    margin: '16px 32px',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'auto auto',
    },
  },
  resultsContainer: {
    display: 'grid',
    gap: '8px',
    justifyContent: 'start',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
  },
  wrap: {
    flexFlow: 'wrap',
  },
  iconSpacing: {
    marginLeft: '4px',
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
  noResultsContainer:{
    padding: '16px 32px',
  },
}));

const searchTermShouldShow = (item, searchTerm) => new RegExp(searchTerm, 'i').test(item.developerName);

const filtersShouldShow = (item, filters) => filters
  .reduce((acc, filter) => filter
    .meets(item, filter.values) && acc, true);

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

function ChplChangeRequestsView(props) {
  const { disallowedFilters, preFilter, scope: $scope } = props;
  const csvExporter = new ExportToCsv(csvOptions);
  const DateUtil = getAngularService('DateUtil');
  const toaster = getAngularService('toaster');
  const { hasAnyRole } = useContext(UserContext);
  const [changeRequest, setChangeRequest] = useState(undefined);
  const [changeRequests, setChangeRequests] = useState([]);
  const [changeRequestStatusTypes, setChangeRequestStatusTypes] = useState([]);
  const [comparator, setComparator] = useState('currentStatusChangeDate');
  const [mode, setMode] = useState('view');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { data, isLoading, isSuccess } = useFetchChangeRequests();
  const crstQuery = useFetchChangeRequestStatusTypes();
  const { mutate } = usePutChangeRequest();
  const { filters, searchTerm } = useFilterContext();
  const classes = useStyles();

  useEffect(() => {
    if (crstQuery.isLoading || !crstQuery.isSuccess) {
      return;
    }
    const types = crstQuery.data.data
      .filter((type) => {
        if (hasAnyRole(['ROLE_DEVELOPER'])) {
          return type.name === 'Pending ONC-ACB Action' || type.name === 'Cancelled by Requester';
        }
        return type.name !== 'Pending ONC-ACB Action' && type.name !== 'Cancelled by Requester';
      })
      .sort((a, b) => (a.name < b.name ? -1 : 1));
    setChangeRequestStatusTypes(types);
  }, [crstQuery.data, crstQuery.isLoading, crstQuery.isSuccess, hasAnyRole]);

  useEffect(() => {
    if (isLoading || !isSuccess) {
      return;
    }
    const crs = data
      .map((item) => ({
        ...item,
        developerName: item.developer.name,
        changeRequestTypeName: item.changeRequestType.name,
        currentStatusName: item.currentStatus.changeRequestStatusType.name,
        currentStatusChangeDate: item.currentStatus.statusChangeDate,
        friendlyReceivedDate: DateUtil.timestampToString(item.submittedDate),
        friendlyCurrentStatusChangeDate: DateUtil.timestampToString(item.currentStatus.statusChangeDate),
      }))
      .filter((item) => preFilter(item))
      .filter((item) => searchTermShouldShow(item, searchTerm))
      .filter((item) => filtersShouldShow(item, filters))
      .sort(sortComparator(comparator));
    setChangeRequests(crs);
  }, [data, isLoading, isSuccess, DateUtil, comparator, filters, searchTerm, preFilter]);

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

  const save = (request) => {
    mutate(request, {
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

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'close':
        setMode('view');
        setChangeRequest(undefined);
        break;
      case 'edit':
        setMode('edit');
        break;
      case 'save':
        save(payload);
        break;
      // no default
    }
  };

  const handleTableSort = (event, property, orderDirection) => {
    setComparator(orderDirection + property);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, changeRequests.length - page * rowsPerPage);
  const pageStart = (page * rowsPerPage) + 1;
  const pageEnd = Math.min((page + 1) * rowsPerPage, changeRequests.length);

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
            <div className={classes.searchContainer} component={Paper}>
              { !disallowedFilters.includes('searchTerm')
                && (
                  <ChplFilterSearchTerm
                    placeholder="Search by Developer..."
                  />
                )}
              <ChplFilterPanel />
            </div>
            <div>
              <ChplFilterChips />
            </div>
            { (isLoading || !isSuccess || changeRequests.length === 0)
              && (
                <>
                  <div className={classes.noResultsContainer}>
                    <Typography>No results found. Please check your search for typos or spelling errors - or try a differnet search term/filter. </Typography>
                  </div>
                </>
              )}
            { !isLoading && isSuccess && changeRequests.length > 0
              && (
                <>
                  <div className={classes.tableResultsHeaderContainer}>
                    <div className={`${classes.resultsContainer} ${classes.wrap}`}>
                      <Typography variant="subtitle2">Search Results:</Typography>
                      <Typography variant="body2">
                        {`(${pageStart}-${pageEnd} of ${changeRequests.length} Results)`}
                      </Typography>
                    </div>
                    <ButtonGroup size="small" className={classes.wrap}>
                      <Button
                        color="secondary"
                        variant="contained"
                        fullWidth
                        id="download-change-requests"
                        onClick={() => csvExporter.generateCsv(changeRequests)}
                      >
                        Download
                        {' '}
                        { changeRequests.length }
                        {' '}
                        Result
                        { changeRequests.length !== 1 ? 's' : '' }
                        <GetAppIcon className={classes.iconSpacing} />
                      </Button>
                    </ButtonGroup>
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
                        {changeRequests
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
                    count={changeRequests.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[10, 50, 100, 250]}
                    setPage={setPage}
                    setRowsPerPage={setRowsPerPage}
                  />
                </>
              )}
          </>
        )}
    </ThemeProvider>
  );
}

export default ChplChangeRequestsView;

ChplChangeRequestsView.propTypes = {
  disallowedFilters: arrayOf(string).isRequired,
  preFilter: func.isRequired,
  scope: object.isRequired, // eslint-disable-line react/forbid-prop-types
};
