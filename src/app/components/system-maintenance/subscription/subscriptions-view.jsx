import React, {
  useEffect,
  useRef,
  useState,
} from 'react';
import { Box, Button } from '@mui/material';
import { shape, string } from 'prop-types';
import { useSnackbar } from 'notistack';
import { NotificationsOutlined } from '@mui/icons-material';

import { useFetchAllSubscriptions, usePostGetDeliveredNotifications } from 'api/subscriptions';
import { usePageState } from 'components/page-state';
import { resultCardSx, resultsHeaderSx } from 'components/system-maintenance/results-styles';
import {
  ChplLink,
  ChplLoadingCards,
  ChplPagination,
  ChplResultsUpdating,
  ChplSearchResultCard,
  ChplSearchResultControls,
  ChplSortControls,
  useResultsUpdating,
} from 'components/util';
import { ChplFilterLayout, ChplFilterSearchBar, useFilterContext } from 'components/filter';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { compareStrings } from 'services/sort.service';
import { palette } from 'themes';

const sortOptions = [
  { property: 'subscriber_email', text: 'Email' },
  { property: 'creation_date', text: 'Creation Date' },
  { property: 'subscriber_role', text: 'Role' },
];

function ChplSubscriptionsView({ analytics }) {
  const storageKey = 'storageKey-manageSubscriptionsView';
  const { enqueueSnackbar } = useSnackbar();
  const [orderBy, setOrderBy] = usePageState(`${storageKey}-orderBy`, 'creation_date');
  const [pageNumber, setPageNumber] = usePageState(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = usePageState(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = usePageState(`${storageKey}-sortDescending`, true);
  const [recordCount, setRecordCount] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const { mutate } = usePostGetDeliveredNotifications();

  const filterContext = useFilterContext();
  const query = filterContext.queryString();
  const {
    data,
    isError,
    isFetching,
    isLoading,
    isPreviousData,
  } = useFetchAllSubscriptions({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query,
  });

  // Old results stay on screen while a new sort, page or filter loads, and a sort shows as updating briefly even when it's cached
  const isUpdating = useResultsUpdating({ isFetching, isPreviousData, sortKey: `${orderBy}-${sortDescending}` });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data.results) {
      setSubscriptions([]);
      return;
    }
    setSubscriptions(data.results.map((subscription) => ({
      ...subscription,
    })));
    setRecordCount(data.recordCount);
  }, [data?.results, data?.recordCount, isError, isLoading]);

  // A new search, sort or page size starts again from the first page. Skipped
  // on mount, so a page remembered from earlier in the session is kept
  const resetKey = `${query}|${orderBy}|${sortDescending}|${pageSize}`;
  const lastResetKey = useRef(resetKey);
  useEffect(() => {
    if (lastResetKey.current === resetKey) { return; }
    lastResetKey.current = resetKey;
    setPageNumber(0);
  }, [resetKey, setPageNumber]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length, setPageNumber]);

  const handleTableSort = (property, orderDirection) => {
    eventTrack({
      event: 'Sort',
      category: analytics.category,
      label: property,
    });
    setOrderBy(property);
    setSortDescending(orderDirection === 'desc');
  };

  const getDeliveredMessages = () => {
    mutate({}, {
      onSuccess: () => {
        const body = 'Please check your email for the report';
        enqueueSnackbar(body, { variant: 'success' });
      },
      onError: (error) => {
        console.error(error);
        const body = 'Error. Please check your credentials or contact the administrator';
        enqueueSnackbar(body, { variant: 'error' });
      },
    });
  };

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, recordCount);

  return (
    <>
      <ChplFilterSearchBar
        sticky
        fadeBackground={palette.white}
        placeholder="Search by Subscriber Email or CHPL Product Number..."
      />
      <ChplFilterLayout>
        { isLoading && (<ChplLoadingCards title fieldGroups={[2, [{ flex: '2 1 320px' }, { lines: 3 }]]} actions={0} controls={1} />)}
        { !isLoading
          && (
            <>
              <ChplSearchResultControls
                sx={resultsHeaderSx}
                wrapActions
                recordCount={recordCount}
                pageStart={pageStart}
                pageEnd={pageEnd}
                fadeBackground={palette.white}
              >
                { subscriptions.length > 0
                  && (
                    <ChplSortControls
                      sortOptions={sortOptions}
                      orderBy={orderBy}
                      order={sortDescending ? 'desc' : 'asc'}
                      onSort={handleTableSort}
                      isUpdating={isUpdating}
                    />
                  )}
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={getDeliveredMessages}
                  endIcon={<NotificationsOutlined fontSize="small" />}
                >
                  Get Delivered Notifications
                </Button>
              </ChplSearchResultControls>
              <ChplResultsUpdating isUpdating={isUpdating}>
                { subscriptions.length > 0
                  && (
                    <>
                      <Box>
                        { subscriptions.map((item) => (
                          <ChplSearchResultCard
                            sx={resultCardSx}
                            key={`${item.subscriberId}-${item.subscribedObjectId}`}
                            cardTitle="CHPL Product"
                            cardTitleValue={(
                              <ChplLink
                                href={`#/listing/${item.subscribedObjectId}`}
                                text={item.subscribedObjectName}
                                analytics={{ event: 'Go to Listing Details Page', category: analytics.category, label: item.subscribedObjectName }}
                                external={false}
                                router={{ sref: 'listing', params: { id: item.subscribedObjectId } }}
                              />
                            )}
                            fieldGroups={[
                              [
                                { label: 'Email', style: { flex: '2 1 320px' }, value: item.subscriberEmail },
                                { label: 'Creation Date', value: getDisplayDateFormat(item.creationDate) },
                              ],
                              [
                                { label: 'Role', style: { flex: '2 1 320px' }, value: item.subscriberRole },
                                {
                                  label: 'Subscription Subjects',
                                  value: (
                                    <Box>
                                      { [...item.subscriptionSubjects]
                                        .sort(compareStrings)
                                        .map((sub) => (
                                          <Box key={sub}>{ sub }</Box>
                                        ))}
                                    </Box>
                                  ),
                                },
                              ],
                            ]}
                          />
                        ))}
                      </Box>
                      <ChplPagination
                        count={recordCount}
                        page={pageNumber}
                        rowsPerPage={pageSize}
                        rowsPerPageOptions={[25, 50, 100]}
                        setPage={setPageNumber}
                        setRowsPerPage={setPageSize}
                        analytics={analytics}
                      />
                    </>
                  )}
              </ChplResultsUpdating>
            </>
          )}
      </ChplFilterLayout>
    </>
  );
}

export default ChplSubscriptionsView;

ChplSubscriptionsView.propTypes = {
  analytics: shape({
    category: string.isRequired,
  }).isRequired,
};
