import React, { useContext, useEffect, useState } from 'react';
import {
  Breadcrumbs,
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
  Typography,
  makeStyles,
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
import GetAppIcon from '@material-ui/icons/GetApp';
import Moment from 'react-moment';
import { arrayOf, string } from 'prop-types';

import ChplChangeRequest from './change-request';
import ChplChangeRequestsDownload from './change-requests-download';

import { useFetchChangeRequests } from 'api/change-requests';
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
import { ChplSortableHeaders } from 'components/util/sortable-headers';
import { getDisplayDateFormat } from 'services/date-util';
import { UserContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

const useStyles = makeStyles(() => ({
  ...utilStyles,
  breadcrumbs: {
    textTransform: 'none',
  },
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

function ChplChangeRequestsView(props) {
  const { disallowedFilters, bonusQuery } = props;
  const { hasAnyRole } = useContext(UserContext);
  const [changeRequest, setChangeRequest] = useState(undefined);
  const [changeRequests, setChangeRequests] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('current_status_change_date_time');
  const [pageNumber, setPageNumber] = React.useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { queryString } = useFilterContext();
  const { data, isLoading, isSuccess } = useFetchChangeRequests({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending: order === 'desc',
    query: `${queryString()}${bonusQuery}`,
  });
  const classes = useStyles();

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  useEffect(() => {
    if (isLoading || !isSuccess || !data) { return; }
    const crs = data.results.map((item) => ({
      ...item,
    }));
    setChangeRequests(crs);
    if (changeRequest?.id) {
      setChangeRequest((inUseCr) => crs.find((cr) => cr.id === inUseCr.id));
    }
  }, [data, isLoading, isSuccess]);

  /* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
  const headers = hasAnyRole(['ROLE_DEVELOPER']) ? [
    { property: 'change_request_type', text: 'Request Type', sortable: true },
    { property: 'change_request_status', text: 'Request Status', sortable: true },
    { property: 'current_status_change_date_time', text: 'Time Since Last Status Change', sortable: true, reverseDefault: true },
    { text: 'Actions', invisible: true },
  ] : [
    { property: 'developer', text: 'Developer', sortable: true },
    { property: 'change_request_type', text: 'Request Type', sortable: true },
    { property: 'submitted_date_time', text: 'Creation Date', sortable: true, reverseDefault: true },
    { property: 'change_request_status', text: 'Request Status', sortable: true },
    { property: 'current_status_change_date_time', text: 'Time Since Last Status Change', sortable: true, reverseDefault: true },
    { text: 'Associated ONC-ACBs' },
    { text: 'Actions', invisible: true },
  ];

  const handleDispatch = (action) => {
    switch (action) {
      case 'close':
        setChangeRequest(undefined);
        break;
      case 'closeDownload':
        setIsDownloading(false);
        break;
      // no default
    }
  };

  const handleTableSort = (event, property, orderDirection) => {
    setOrderBy(property);
    setOrder(orderDirection);
  };

  const showBreadcrumbs = () => !bonusQuery;

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, data?.recordCount);

  if (changeRequest) {
    return (
      <Card>
        <CardHeader title="Change Requests" />
        <CardContent>
          <ChplChangeRequest
            changeRequest={changeRequest}
            dispatch={handleDispatch}
            showBreadcrumbs={showBreadcrumbs()}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Change Requests" />
      <CardContent>
        { isDownloading
          && (
            <ChplChangeRequestsDownload
              dispatch={handleDispatch}
              query={`${queryString()}${bonusQuery}`}
            />
          )}
        { showBreadcrumbs()
          && (
            <Breadcrumbs aria-label="Change Requests navigation">
              <Button
                variant="text"
                className={classes.breadcrumbs}
                disabled
              >
                Change Requests
              </Button>
            </Breadcrumbs>
          )}
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
        { isLoading
          && (
            <div className={classes.noResultsContainer}>
              <CircularProgress />
            </div>
          )}
        { !isLoading && !isSuccess
          && (
            <div className={classes.noResultsContainer}>
              Network error
            </div>
          )}
        { !isLoading && isSuccess && changeRequests.length === 0
          && (
            <div className={classes.noResultsContainer}>
              No results found
            </div>
          )}
        { !isLoading && isSuccess && changeRequests.length > 0
          && (
            <>
              <div className={classes.tableResultsHeaderContainer}>
                <div className={`${classes.resultsContainer} ${classes.wrap}`}>
                  <Typography variant="subtitle2">Search Results:</Typography>
                  <Typography variant="body2">
                    {`(${pageStart}-${pageEnd} of ${data?.recordCount} Results)`}
                  </Typography>
                </div>
                <ButtonGroup size="small" className={classes.wrap}>
                  <Button
                    color="secondary"
                    variant="contained"
                    fullWidth
                    id="download-change-requests"
                    onClick={() => setIsDownloading(true)}
                  >
                    Download
                    {' '}
                    { data.recordCount }
                    {' '}
                    Result
                    { data.recordCount !== 1 ? 's' : '' }
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
                      .map((item) => (
                        <TableRow key={item.id}>
                          { !hasAnyRole(['ROLE_DEVELOPER'])
                           && (
                             <TableCell className={classes.tableFirstColumn}>
                               <div className={classes.tableDeveloperCell}>
                                 <div>
                                   <ChplAvatar
                                     text={item.developer.name}
                                   />
                                 </div>
                                 <div className={classes.developerName}>
                                   <a href={`#/organizations/developers/${item.developer.id}`}>
                                     {item.developer.name}
                                   </a>
                                 </div>
                               </div>
                             </TableCell>
                           )}
                          <TableCell>{item.changeRequestType.name}</TableCell>
                          { !hasAnyRole(['ROLE_DEVELOPER'])
                           && <TableCell>{getDisplayDateFormat(item.submittedDateTime)}</TableCell>}
                          <TableCell>{item.currentStatus.name}</TableCell>
                          <TableCell>
                            <Moment
                              withTitle
                              titleFormat="DD MMM yyyy"
                              fromNow
                            >
                              {item.currentStatus.statusChangeDateTime}
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
                  </TableBody>
                </Table>
              </TableContainer>
              <ChplPagination
                count={data.recordCount}
                page={pageNumber}
                rowsPerPage={pageSize}
                rowsPerPageOptions={[10, 50, 100, 250]}
                setPage={setPageNumber}
                setRowsPerPage={setPageSize}
              />
            </>
          )}
      </CardContent>
    </Card>
  );
}

export default ChplChangeRequestsView;

ChplChangeRequestsView.propTypes = {
  disallowedFilters: arrayOf(string).isRequired,
  bonusQuery: string.isRequired,
};
