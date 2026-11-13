import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

import ChplActivityDetails from './activity-details';

import { useFetchActivity } from 'api/questionable-activity';
import { usePageState } from 'components/page-state';
import {
  ChplLink,
  ChplLoadingCards,
  ChplPageBody,
  ChplPageHeader,
  ChplPagination,
  ChplResultsUpdating,
  ChplSearchResultCard,
  ChplSearchResultControls,
  ChplSortControls,
  useResultsUpdating,
} from 'components/util';
import {
  ChplFilterLayout,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { useAnalyticsContext } from 'shared/contexts';

function ChplActivityView() {
  const storageKey = 'storageKey-activity';
  const { analytics } = useAnalyticsContext();
  const [activities, setActivities] = useState([]);
  const [orderBy, setOrderBy] = usePageState(`${storageKey}-orderBy`, 'activity_date');
  const [pageNumber, setPageNumber] = usePageState(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = usePageState(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = usePageState(`${storageKey}-sortDescending`, true);
  const [recordCount, setRecordCount] = useState(0);

  const filterContext = useFilterContext();
  const {
    data,
    isError,
    isFetching,
    isLoading,
    isPreviousData,
  } = useFetchActivity({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query: filterContext.queryString(),
  });

  // Old results stay on screen while a new sort, page or filter loads, and a sort shows as updating briefly even when it's cached
  const isUpdating = useResultsUpdating({ isFetching, isPreviousData, sortKey: `${orderBy}-${sortDescending}` });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data.results) {
      setActivities([]);
      return;
    }
    setActivities(data.results.map((activity) => ({
      ...activity,
    })));
    setRecordCount(data.recordCount);
  }, [data?.results, data?.recordCount, isError, isLoading, analytics]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  /* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
  const sortOptions = [
    { property: 'activity_date', text: 'Activity Date', reverseDefault: true },
  ];

  const getLink = (activity) => {
    if (![
      'CERTIFIED_PRODUCT',
      'DEVELOPER',
      'PRODUCT',
      'VERSION',
    ].includes(activity.concept)) {
      return null;
    }
    const after = JSON.parse(activity.after);
    switch (activity.concept) {
      case 'CERTIFIED_PRODUCT':
        return (
          <ChplLink
            href={`#/listing/${activity.objectId}`}
            text={after.chplProductNumber}
            external={false}
            router={{ sref: 'listing', params: { id: activity.objectId } }}
            analytics={{
              event: 'Navigate to Listing',
              category: 'Activity Search',
            }}
          />
        );
      case 'DEVELOPER':
        if (!after?.id) {
          return null;
        }
        return (
          <ChplLink
            href={`#/organizations/developers/${activity.objectId}`}
            text={after.name}
            analytics={{
              event: 'Navigate to Developer',
              category: 'Activity Search',
            }}
            external={false}
            router={{ sref: 'organizations.developers.developer', params: { id: activity.objectId } }}
          />
        );
      case 'PRODUCT':
        if (!after?.id) {
          return null;
        }
        return (
          <ChplLink
            href={`#/organizations/developers/${after.owner.id}`}
            text={after.owner.name}
            analytics={{
              event: 'Navigate to Developer',
              category: 'Activity Search',
            }}
            external={false}
            router={{ sref: 'organizations.developers.developer', params: { id: after.owner.id } }}
          />
        );
      case 'VERSION':
        if (!after?.id) {
          return null;
        }
        return (
          <ChplLink
            href={`#/organizations/developers/${after.developerId}`}
            text={after.developerName}
            analytics={{
              event: 'Navigate to Developer',
              category: 'Activity Search',
            }}
            external={false}
            router={{ sref: 'organizations.developers.developer', params: { id: after.developerId } }}
          />
        );
      default:
        return null;
    }
  };

  const handleSort = (property, orderDirection) => {
    eventTrack({
      ...analytics,
      event: 'Sort Column',
      label: `${property} - ${orderDirection === 'desc' ? 'DESC' : 'ASC'}`,
    });
    setOrderBy(property);
    setSortDescending(orderDirection === 'desc');
  };

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, recordCount);

  // The filter bar and chips show their own skeletons while the filters load, so the results wait with them
  const showLoading = isLoading || filterContext.isLoading;

  return (
    <>
      <ChplPageHeader text="Activity" />
      <ChplPageBody>
        <ChplFilterSearchBar
          sticky
          placeholder="Search by Description or Reason..."
        />
        <ChplFilterLayout>
          { showLoading && (<ChplLoadingCards title fieldGroups={[[{}, {}, {}], [{ flex: '2 1 320px' }, { flex: '2 1 320px' }]]} actions={1} controls={1} />)}
          { !showLoading
          && (
            <>
              <ChplSearchResultControls
                recordCount={recordCount}
                pageStart={pageStart}
                pageEnd={pageEnd}
              >
                <ChplSortControls
                  sortOptions={sortOptions}
                  orderBy={orderBy}
                  order={sortDescending ? 'desc' : 'asc'}
                  onSort={handleSort}
                  isUpdating={isUpdating}
                />
              </ChplSearchResultControls>
              <ChplResultsUpdating isUpdating={isUpdating}>
                { activities.length > 0
                  && (
                    <>
                      <Box>
                        { activities.map((item) => (
                          <ChplSearchResultCard
                            key={item.id}
                            cardTitle="User"
                            cardTitleValue={item.username}
                            fieldGroups={[
                              [
                                { label: 'Concept', value: item.concept },
                                { label: 'Activity Date', value: getDisplayDateFormat(item.activityDate) },
                                { label: 'CHPL Link', value: getLink(item) || 'N/A' },
                              ],
                              [
                                {
                                  label: 'Description',
                                  style: { flex: '2 1 320px' },
                                  value: item.description || 'N/A',
                                },
                                {
                                  label: 'Reason',
                                  style: { flex: '2 1 320px' },
                                  value: item.reason || 'N/A',
                                },
                              ],
                            ]}
                            actions={<ChplActivityDetails activity={item} />}
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
                      />
                    </>
                  )}
              </ChplResultsUpdating>
            </>
          )}
        </ChplFilterLayout>
      </ChplPageBody>
    </>
  );
}

export default ChplActivityView;

ChplActivityView.propTypes = {
};
