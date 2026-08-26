import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  MenuItem,
  MenuList,
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
  ChplLoadingCards,
  ChplPagination,
  ChplSearchResultCard,
  ChplSearchResultControls,
  ChplSortControls,
} from 'components/util';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { UserContext, useAnalyticsContext } from 'shared/contexts';
import { palette, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
  card: {
    overflow: 'visible',
  },
  resultsContainer: {
    padding: ({ embedded }) => (embedded ? '0' : '0 32px'),
  },
  developerTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  noResultsContainer: {
    padding: '16px 32px',
  },
});

function ChplChangeRequestsView({
  disallowedFilters, bonusQuery, dispatch, embedded = false,
}) {
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
  const classes = useStyles({ embedded });

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

  const isDeveloper = hasAnyRole(['chpl-developer']);
  const sortOptions = isDeveloper ? [
    { property: 'change_request_type', text: 'Request Type' },
    { property: 'change_request_status', text: 'Request Status' },
    { property: 'current_status_change_date_time', text: 'Time Since Last Status Change', reverseDefault: true },
  ] : [
    { property: 'developer', text: 'Developer' },
    { property: 'change_request_type', text: 'Request Type' },
    { property: 'submitted_date_time', text: 'Creation Date', reverseDefault: true },
    { property: 'change_request_status', text: 'Request Status' },
    { property: 'current_status_change_date_time', text: 'Time Since Last Status Change', reverseDefault: true },
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

  const handleSort = (property, orderDirection) => {
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
  const recordCount = data?.recordCount ?? 0;

  const content = (
    <>
      <ChplFilterSearchBar
        sticky={!embedded}
        fadeBackground={palette.white}
        placeholder="Search by Developer..."
        hideSearchTerm={disallowedFilters.includes('searchTerm')}
      />
      <ChplFilterLayout mobileOnly={embedded}>
        { isLoading && (<ChplLoadingCards />)}
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
            { !isError
              && (
                <>
                  <ChplSearchResultControls
                    recordCount={recordCount}
                    pageStart={pageStart}
                    pageEnd={pageEnd}
                    fadeBackground={palette.white}
                    sticky={!embedded}
                  >
                    <ChplSortControls
                      sortOptions={sortOptions}
                      orderBy={orderBy}
                      order={order}
                      onSort={handleSort}
                    />
                    { changeRequests.length > 0
                      && (
                        <ChplChangeRequestsDownload
                          bonusQuery={bonusQuery}
                          queryParams={queryParams()}
                          recordCount={recordCount}
                        />
                      )}
                  </ChplSearchResultControls>
                  { changeRequests.length > 0
                    && (
                      <>
                        <Box className={classes.resultsContainer}>
                          { changeRequests.map((item) => (
                            <ChplSearchResultCard
                              key={item.id}
                              cardTitle={isDeveloper ? undefined : 'Developer'}
                              cardTitleValue={isDeveloper ? undefined : (
                                <Box className={classes.developerTitle}>
                                  <ChplAvatar text={item.developer.name} />
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
                                </Box>
                              )}
                              fieldGroups={isDeveloper ? [
                                [
                                  { label: 'Request Type', value: item.changeRequestType.name },
                                  { label: 'Request Status', value: item.currentStatus.name },
                                  {
                                    label: 'Time Since Last Status Change',
                                    value: (
                                      <Moment
                                        withTitle
                                        titleFormat="DD MMM yyyy"
                                        fromNow
                                      >
                                        {item.currentStatus.statusChangeDateTime}
                                      </Moment>
                                    ),
                                  },
                                ],
                              ] : [
                                [
                                  { label: 'Request Type', value: item.changeRequestType.name },
                                  { label: 'Creation Date', value: getDisplayDateFormat(item.submittedDateTime) },
                                  { label: 'Request Status', value: item.currentStatus.name },
                                ],
                                [
                                  {
                                    label: 'Time Since Last Status Change',
                                    style: { flex: '0 1 calc((100% - 56px) / 3)' },
                                    value: (
                                      <Moment
                                        withTitle
                                        titleFormat="DD MMM yyyy"
                                        fromNow
                                      >
                                        {item.currentStatus.statusChangeDateTime}
                                      </Moment>
                                    ),
                                  },
                                  {
                                    label: 'Associated ONC-ACBs',
                                    style: { flex: '0 1 calc((100% - 56px) / 3)' },
                                    value: item.certificationBodies.length === 0
                                      ? 'None'
                                      : item.certificationBodies.map((acb) => acb.name).join('; '),
                                  },
                                ],
                              ]}
                              actions={(
                                <Button
                                  onClick={() => viewChangeRequest(item)}
                                  variant="outlined"
                                  color="primary"
                                >
                                  View
                                  {' '}
                                  <VisibilityIcon className={classes.iconSpacing} />
                                </Button>
                              )}
                            />
                          ))}
                        </Box>
                        <ChplPagination
                          count={recordCount}
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
    <Card className={classes.card}>
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
