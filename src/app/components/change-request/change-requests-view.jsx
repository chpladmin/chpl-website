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
  Typography,
  makeStyles,
} from '@material-ui/core';
import VisibilityIcon from '@material-ui/icons/Visibility';
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
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    maxHeight: '64vh',
  },
  searchContainer: {
    backgroundColor: palette.grey,
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
});

function ChplChangeRequestsView(props) {
  const { disallowedFilters, bonusQuery } = props;
  const { hasAnyRole } = useContext(UserContext);
  const [changeRequest, setChangeRequest] = useState(undefined);
  const [changeRequests, setChangeRequests] = useState([]);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('current_status_change_date_time');
  const [pageNumber, setPageNumber] = React.useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { queryParams, queryString } = useFilterContext();
  const {
    data, error, isError, isLoading, isSuccess,
  } = useFetchChangeRequests({
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
      // no default
    }
  };

  const handleTableSort = (event, property, orderDirection) => {
    setOrderBy(property);
    setOrder(orderDirection);
  };

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
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader title="Change Requests" />
      <CardContent>
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
        { !isLoading
          && (
            <>
              { isError
                && (
                  <>
                    <div className={classes.noResultsContainer}>
                      No results were found, due to invalid parameters:
                    </div>
                    <ul>
                      {error.response.data.errorMessages.map((msg) => (
                        <li key={msg}>{msg}</li>
                      ))}
                    </ul>
                  </>
                )}
              { isSuccess
                && (
                  <>
                    { changeRequests.length === 0
                      && (
                        <div className={classes.noResultsContainer}>
                          No results found
                        </div>
                      )}
                    { changeRequests.length > 0
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
                              <ChplChangeRequestsDownload
                                bonusQuery={bonusQuery}
                                queryParams={queryParams()}
                                recordCount={data.recordCount}
                              />
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
                  </>
                )}
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
