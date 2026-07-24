import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  MenuItem,
  MenuList,
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
import {
  arrayOf, bool, func, string,
} from 'prop-types';

import ChplChangeRequest from './change-request';
import ChplChangeRequestsDownload from './change-requests-download';

import { useFetchChangeRequests } from 'api/change-requests';
import {
  ChplFilterLayout,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import {
  ChplAvatar,
  ChplLink,
  ChplPagination,
  ChplSortableHeaders,
} from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { UserContext, useAnalyticsContext } from 'shared/contexts';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  container: {
    maxHeight: '64vh',
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
    backgroundColor: palette.white,
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

function ChplChangeRequestsView({ disallowedFilters, bonusQuery, dispatch, embedded = false }) {
  const storageKey = 'storageKey-changeRequestsView';
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
  const [changeRequest, setChangeRequest] = useState(undefined);
  const [changeRequests, setChangeRequests] = useState([]);
  const [order, setOrder] = useStorage(`${storageKey}-order`, 'desc');
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'current_status_change_date_time');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 10);
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
  const headers = hasAnyRole(['chpl-developer']) ? [
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

  const handleDispatch = (action, payload) => {
    switch (action) {
      case 'close':
        setChangeRequest(undefined);
        break;
      case 'editAttestation':
        dispatch('editAttestation', payload);
        break;
      // no default
    }
  };

  const handleTableSort = (event, property, orderDirection) => {
    eventTrack({
      ...analytics,
      event: 'Sort Column',
      label: `${property} - ${orderDirection === 'desc' ? 'DESC' : 'ASC'}`,
    });
    setOrderBy(property);
    setOrder(orderDirection);
  };

  const viewChangeRequest = (cr) => {
    eventTrack({
      ...analytics,
      event: 'View Change Request',
      label: cr.changeRequestType.name,
      aggregationGroup: cr.developer.name,
    });
    setChangeRequest(cr);
  };

  if (changeRequest) {
    return (
      <ChplChangeRequest
        changeRequest={changeRequest}
        dispatch={handleDispatch}
      />
    );
  }

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, data?.recordCount);

  const content = (
    <>
      <ChplFilterSearchBar
        placeholder="Search by Developer..."
        hideSearchTerm={disallowedFilters.includes('searchTerm')}
      />
      <ChplFilterLayout>
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
                  <MenuList>
                    {error.response.data.errorMessages?.map((msg) => (
                      <MenuItem key={msg}>{msg}</MenuItem>
                    ))}
                  </MenuList>
                </>
              )}
            { isSuccess
              && (
                <>
                  <div className={classes.tableResultsHeaderContainer}>
                    <div className={`${classes.resultsContainer} ${classes.wrap}`}>
                      <Typography variant="subtitle2">Search Results:</Typography>
                      { changeRequests.length === 0
                        && (
                          <>
                            No results found
                          </>
                        )}
                      { changeRequests.length > 0
                        && (
                          <Typography variant="body2">
                            {`(${pageStart}-${pageEnd} of ${data?.recordCount} Results)`}
                          </Typography>
                        )}
                    </div>
                    { changeRequests.length > 0
                      && (
                        <ButtonGroup size="small" className={classes.wrap}>
                          <ChplChangeRequestsDownload
                            bonusQuery={bonusQuery}
                            queryParams={queryParams()}
                            recordCount={data.recordCount}
                          />
                        </ButtonGroup>
                      )}
                  </div>
                  { changeRequests.length > 0
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
                              orderBy={orderBy}
                              order={order}
                              stickyHeader
                            />
                            <TableBody>
                              {changeRequests
                                .map((item) => (
                                  <TableRow key={item.id}>
                                    { !hasAnyRole(['chpl-developer'])
                                     && (
                                       <TableCell className={classes.tableFirstColumn}>
                                         <div className={classes.tableDeveloperCell}>
                                           <div>
                                             <ChplAvatar
                                               text={item.developer.name}
                                             />
                                           </div>
                                           <div className={classes.developerName}>
                                             <ChplLink
                                               href={`#/organizations/developers/${item.developer.id}`}
                                               text={item.developer.name}
                                               analytics={{
                                                 ...analytics,
                                                 event: 'Navigate to Developer Page',
                                               }}
                                               external={false}
                                               router={{ sref: 'organizations.developers.developer', options: { id: item.developer.id } }}
                                             />
                                           </div>
                                         </div>
                                       </TableCell>
                                     )}
                                    <TableCell>{item.changeRequestType.name}</TableCell>
                                    { !hasAnyRole(['chpl-developer'])
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
                                    { !hasAnyRole(['chpl-developer'])
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
                                        onClick={() => viewChangeRequest(item)}
                                        variant="outlined"
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
                          sticky={!embedded}
                        />
                      </>
                    )}
                </>
              )}
          </>
        )}
      </ChplFilterLayout>
    </>
  );

  return (
    <Card>
      { bonusQuery
        && (
          <CardHeader title="Change Requests" />
        )}
      <CardContent>
        { content }
      </CardContent>
    </Card>
  );
}

export default ChplChangeRequestsView;

ChplChangeRequestsView.propTypes = {
  disallowedFilters: arrayOf(string).isRequired,
  bonusQuery: string.isRequired,
  dispatch: func.isRequired,
  embedded: bool,
};
