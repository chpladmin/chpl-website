import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
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
import { arrayOf, func, string } from 'prop-types';
import { ExportToCsv } from 'export-to-csv';

import ChplChangeRequestEdit from './change-request-edit';
import ChplChangeRequestView from './change-request-view';
import fillCustomAttestationFields from './types/attestation-fill-fields';
import fillCustomDemographicsFields from './types/demographics-fill-fields';

import { useFetchChangeRequests, useFetchChangeRequestsLegacy } from 'api/change-requests';
import {
  ChplFilterChips,
  ChplFilterPanel,
  ChplFilterSearchTerm,
  useFilterContext,
} from 'components/filter';
import {
  ChplAvatar,
  ChplPagination,
} from 'components/util';
import { ChplSortableHeaders, sortComparator } from 'components/util/sortable-headers';
import { getAngularService } from 'services/angular-react-helper';
import { FlagContext, UserContext } from 'shared/contexts';
import theme from 'themes/theme';

const CUSTOM_FIELD_COUNT = 7;
const csvOptions = {
  showLabels: true,
  headers: [
    { headerName: 'Developer', objectKey: 'developerName' },
    { headerName: 'Request Type', objectKey: 'changeRequestTypeName' },
    { headerName: 'Creation Date', objectKey: 'friendlyReceivedDate' },
    { headerName: 'Request Status', objectKey: 'currentStatusName' },
    { headerName: 'Last Status Change', objectKey: 'friendlyCurrentStatusChangeDate' },
    { headerName: 'Relevant ONC-ACBs', objectKey: 'relevantAcbs' },
    ...Array(CUSTOM_FIELD_COUNT)
      .fill('Custom Field')
      .map((val, idx) => ({
        headerName: `${val} ${idx + 1}`,
        objectKey: `field${idx + 1}`,
      })),
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
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
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
  noResultsContainer: {
    padding: '16px 32px',
  },
}));

const searchTermShouldShow = (item, searchTerm) => new RegExp(searchTerm, 'i').test(item.developerName);

const filtersShouldShow = (item, filters) => filters
  .reduce((acc, filter) => filter
    .meets(item, filter.values) && acc, true);

const fillWithBlanks = (def = '') => Array(CUSTOM_FIELD_COUNT)
  .fill(def)
  .reduce((obj, v, idx) => ({
    ...obj,
    [`field${idx + 1}`]: v,
  }), {});

const getCustomFields = (item) => {
  switch (item.changeRequestType.name) {
    case 'Developer Attestation Change Request':
      return fillCustomAttestationFields(item.details);
    case 'Developer Demographics Change Request':
      return fillCustomDemographicsFields(item);
    default:
      return fillWithBlanks();
  }
};

function ChplChangeRequestsView(props) {
  const $state = getAngularService('$state');
  const DateUtil = getAngularService('DateUtil');
  const { disallowedFilters, preFilter } = props;
  const csvExporter = new ExportToCsv(csvOptions);
  const { isOn } = useContext(FlagContext);
  const { hasAnyRole } = useContext(UserContext);
  const [changeRequest, setChangeRequest] = useState(undefined);
  const [changeRequests, setChangeRequests] = useState([]);
  const [order, setOrder] = useState('desc'); // sortdescending?
  const [orderBy, setOrderBy] = useState('currentStatusChangeDate');
  const [mode, setMode] = useState('view');
  const [page, setPage] = React.useState(0); // pageNumber
  const [rowsPerPage, setRowsPerPage] = useState(10); // pageSize
  const legacyFetch = useFetchChangeRequestsLegacy();
  const { filters, queryString, searchTerm } = useFilterContext();
  const { isLoading, isSuccess, data } = useFetchChangeRequests({
    orderBy,
    pageNumber: page,
    pageSize: rowsPerPage,
    sortDescending: order === 'desc',
    query: queryString(),
  });
  const classes = useStyles();

  /*
  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);
  */

  useEffect(() => {
    if (isLoading || !isSuccess || !data) { return; }
    console.log(data);
  }, [data?.results, isLoading]);

  useEffect(() => {
    if (legacyFetch.isLoading || !legacyFetch.isSuccess) {
      return;
    }
    const crs = legacyFetch.data
      .map((item) => ({
        ...item,
        ...getCustomFields(item),
        developerName: item.developer.name,
        changeRequestTypeName: item.changeRequestType.name,
        currentStatusName: item.currentStatus.changeRequestStatusType.name,
        currentStatusChangeDate: item.currentStatus.statusChangeDate,
        friendlyReceivedDate: DateUtil.timestampToString(item.submittedDate),
        friendlyCurrentStatusChangeDate: DateUtil.timestampToString(item.currentStatus.statusChangeDate),
        relevantAcbs: item.certificationBodies.sort((a, b) => (a.name < b.name ? -1 : 1)).map((acb) => acb.name).join(';'),
      }))
      .filter((item) => preFilter(item))
      .filter((item) => searchTermShouldShow(item, searchTerm))
      .filter((item) => filtersShouldShow(item, filters))
      .sort(sortComparator(orderBy, order === 'desc'));
    setChangeRequests(crs);
    if (changeRequest?.id) {
      setChangeRequest((inUseCr) => crs.find((cr) => cr.id === inUseCr.id));
    }
  }, [legacyFetch.data, legacyFetch.isLoading, legacyFetch.isSuccess, DateUtil, orderBy, order, filters, searchTerm, preFilter]);

  /* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
  const headers = hasAnyRole(['ROLE_DEVELOPER']) ? [
    { property: 'changeRequestTypeName', text: 'Request Type', sortable: true },
    { property: 'currentStatusName', text: 'Request Status', sortable: true },
    { property: 'currentStatusChangeDate', text: 'Time Since Last Status Change', sortable: true, reverseDefault: true },
    { property: 'actions', text: 'Actions', invisible: true },
  ] : [
    { property: 'developerName', text: 'Developer', sortable: true },
    { property: 'changeRequestTypeName', text: 'Request Type', sortable: true },
    { property: 'receivedDate', text: 'Creation Date', sortable: true, reverseDefault: true },
    { property: 'currentStatusName', text: 'Request Status', sortable: true },
    { property: 'currentStatusChangeDate', text: 'Time Since Last Status Change', sortable: true, reverseDefault: true },
    { property: 'associatedAcbs', text: 'Associated ONC-ACBs' },
    { property: 'actions', text: 'Actions', invisible: true },
  ];

  const handleDispatch = (action) => {
    switch (action) {
      case 'close':
        setMode('view');
        setChangeRequest(undefined);
        break;
      case 'edit':
        if (hasAnyRole(['ROLE_DEVELOPER'])
            && changeRequest.changeRequestType.name === 'Developer Attestation Change Request'
            && isOn('attestations-edit')) {
          $state.go('organizations.developers.developer.attestation.edit', { changeRequest });
        } else {
          setMode('edit');
        }
        break;
      // no default
    }
  };

  const handleTableSort = (event, property, orderDirection) => {
    setOrderBy(property);
    setOrder(orderDirection);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, changeRequests.length - page * rowsPerPage);
  const pageStart = (page * rowsPerPage) + 1;
  const pageEnd = Math.min((page + 1) * rowsPerPage, changeRequests.length);

  return (
    <ThemeProvider theme={theme}>
      <Card>
        <CardHeader title="Change Requests" />
        <CardContent>
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
                { legacyFetch.isLoading
                  && (
                    <div className={classes.noResultsContainer}>
                      <CircularProgress />
                    </div>
                  )}
                { (!legacyFetch.isLoading && (!legacyFetch.isSuccess || changeRequests.length === 0))
                  && (
                    <div className={classes.noResultsContainer}>
                      No results found
                    </div>
                  )}
                { !legacyFetch.isLoading && legacyFetch.isSuccess && changeRequests.length > 0
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
                            orderBy={orderBy}
                            order={order}
                            stickyHeader
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
                                  <TableCell>
                                    <Moment
                                      withTitle
                                      titleFormat="DD MMM yyyy"
                                      fromNow
                                    >
                                      {item.currentStatusChangeDate}
                                    </Moment>
                                  </TableCell>
                                  { !hasAnyRole(['ROLE_DEVELOPER'])
                                    && (
                                      <TableCell>
                                        { item.certificationBodies.length === 0
                                          ? (
                                            <>
                                              None
                                            </>
                                          ) : (
                                            <>
                                              { item.certificationBodies.map((acb) => acb.name).join('; ') }
                                            </>
                                          )}
                                      </TableCell>
                                    )}
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
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}

export default ChplChangeRequestsView;

ChplChangeRequestsView.propTypes = {
  disallowedFilters: arrayOf(string).isRequired,
  preFilter: func.isRequired,
};
