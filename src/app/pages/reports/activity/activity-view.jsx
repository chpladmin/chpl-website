import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  makeStyles,
} from '@material-ui/core';

import ChplActivityDetails from './activity-details';

import { useFetchActivity } from 'api/questionable-activity';
import {
  ChplLink,
  ChplLoadingCards,
  ChplPagination,
  ChplSearchResultCard,
  ChplSearchResultControls,
  ChplSortControls,
} from 'components/util';
import {
  ChplFilterLayout,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { eventTrack } from 'services/analytics.service';
import { getDisplayDateFormat } from 'services/date-util';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { useAnalyticsContext } from 'shared/contexts';

const useStyles = makeStyles({
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 188px)',
  },
  pageHeader: {
    padding: '32px',
    backgroundColor: '#ffffff',
  },
  pageBody: {
    display: 'grid',
    gridTemplateColumns: ' 1fr',
    gap: '16px',
    padding: '16px 32px',
    backgroundColor: '#f9f9f9',
  },
  resultsContainer: {
    padding: '0px 32px',
  },
});

function ChplActivityView() {
  const storageKey = 'storageKey-activity';
  const { analytics } = useAnalyticsContext();
  const [activities, setActivities] = useState([]);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'activity_date');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, true);
  const [recordCount, setRecordCount] = useState(0);
  const classes = useStyles();

  const filterContext = useFilterContext();
  const { data, isError, isLoading } = useFetchActivity({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query: filterContext.queryString(),
  });

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
            router={{ sref: 'listing', options: { id: activity.objectId } }}
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
            router={{ sref: 'organizations.developers.developer', options: { id: activity.objectId } }}
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
            router={{ sref: 'organizations.developers.developer', options: { id: after.owner.id } }}
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
            router={{ sref: 'organizations.developers.developer', options: { id: after.developerId } }}
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

  return (
    <div className={classes.fixFooterSpacing}>
      <div className={classes.pageHeader}>
        <Typography variant="h1">Activity</Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <ChplFilterSearchBar
          sticky
          placeholder="Search by Description or Reason..."
        />
        <ChplFilterLayout>
          { isLoading && (<ChplLoadingCards />)}
          { !isLoading
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
                />
              </ChplSearchResultControls>
              { activities.length > 0
                && (
                  <>
                    <Box className={classes.resultsContainer}>
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
            </>
          )}
        </ChplFilterLayout>
      </div>
    </div>
  );
}

export default ChplActivityView;

ChplActivityView.propTypes = {
};
