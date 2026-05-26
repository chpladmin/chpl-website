import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  makeStyles,
} from '@material-ui/core';

import { useFetchListings } from 'api/search';
import ChplActionButton from 'components/action-widget/action-button';
import ChplDownloadListings from 'components/download-listings/download-listings';
import {
  ChplLink,
  ChplPagination,
  ChplSearchResultCard,
  ChplSortControls,
} from 'components/util';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { eventTrack } from 'services/analytics.service';
import { getStatusIcon } from 'services/listing.service';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { useAnalyticsContext } from 'shared/contexts';
import { theme } from 'themes';

/* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
const sortOptions = [
  { property: 'chpl_id', text: 'CHPL ID' },
  { property: 'developer', text: 'Developer' },
  { property: 'product', text: 'Product' },
  { property: 'version', text: 'Version' },
  { property: 'open_surveillance_nc_count', text: '# Open Surveillance NCs' },
  { property: 'closed_surveillance_nc_count', text: '# Closed Surveillance NCs' },
  { property: 'open_direct_review_nc_count', text: '# Open Direct Review NCs' },
  { property: 'closed_direct_review_nc_count', text: '# Closed Direct Review NCs' },
];

const useStyles = makeStyles({
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 158px)',
  },
  resultsHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '8px',
    marginBottom: '16px',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    padding: '16px 32px',
    backgroundColor: '#ffffff',
    boxShadow: `0px 2px 4px -1px ${theme.palette.grey[300]}, 0px 4px 5px 0px ${theme.palette.grey[300]}, 0px 1px 10px 0px ${theme.palette.grey[300]}`,
  },
  resultsContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  cardsContainer: {
    margin: '0px 24px',
  },
});

function ChplCorrectiveActionSearchView() {
  const storageKey = 'storageKey-correctiveActionView';
  const { analytics } = useAnalyticsContext();
  const [directReviewsAvailable, setDirectReviewsAvailable] = useState(true);
  const [listings, setListings] = useState([]);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'open_surveillance_nc_count');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, true);
  const [recordCount, setRecordCount] = useState(0);
  const classes = useStyles();
  const toggledCsvDefaults = ['compliance'];

  const filterContext = useFilterContext();
  const { data, isError, isLoading } = useFetchListings({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query: filterContext.queryString(),
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data.results) {
      setListings([]);
      return;
    }
    setDirectReviewsAvailable(data?.directReviewsAvailable);
    setListings(data.results.map((listing) => ({
      ...listing,
    })));
    setRecordCount(data.recordCount);
  }, [data?.directReviewsAvailable, data?.results, data?.recordCount, isError, isLoading]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

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
      {!isLoading && !directReviewsAvailable
        && (
          <>
            <Typography variant="body1" gutterBottom>
              This information is temporarily unavailable. Please check back later.
            </Typography>
            <Typography variant="body1">
              Surveillance and Direct Review information can be downloaded from the
              {' '}
              <ChplLink
                href="#/resources/download"
                text="Download the CHPL"
                analytics={{
                  ...analytics,
                  event: 'Navigate to Download the CHPL',
                }}
                external={false}
                router={{ sref: 'resources.download' }}
                inline
              />
            </Typography>
          </>
        )}
      {directReviewsAvailable
        && (
          <>
            <ChplFilterSearchBar />
            <div>
              <ChplFilterChips />
            </div>
            {isLoading
              && (
                <Box display="flex" justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
                  <CircularProgress />
                </Box>
              )}
            {!isLoading
              && (
                <>
                  <div className={classes.resultsHeaderContainer}>
                    <div className={classes.resultsContainer}>
                      <Typography variant="subtitle2">Search Results:</Typography>
                      {listings.length === 0
                        && (
                          <Typography>
                            No results found
                          </Typography>
                        )}
                      {listings.length > 0
                        && (
                          <Typography variant="body2">
                            {`(${pageStart}-${pageEnd} of ${recordCount} Results)`}
                          </Typography>
                        )}
                    </div>
                    {listings.length > 0
                      && (
                        <Box display="flex" alignItems="center" gap={2}>
                          <ChplSortControls
                            sortOptions={sortOptions}
                            orderBy={orderBy}
                            order={sortDescending ? 'desc' : 'asc'}
                            onSort={handleSort}
                          />
                          <ChplDownloadListings
                            listings={listings}
                            toggled={toggledCsvDefaults}
                          />
                        </Box>
                      )}
                  </div>
                  {listings.length > 0
                    && (
                      <>
                        <Box className={classes.cardsContainer}>
                          {listings.map((item) => (
                            <ChplSearchResultCard
                              key={item.id}
                              cardTitle="CHPL ID"
                              cardTitleValue={(
                                <ChplLink
                                  href={`#/listing/${item.id}`}
                                  text={item.chplProductNumber}
                                  analytics={{
                                    ...analytics,
                                    event: 'Navigate to Listing Details Page',
                                    label: item.chplProductNumber,
                                    aggregationName: item.product.name,
                                  }}
                                  external={false}
                                  router={{ sref: 'listing', options: { id: item.id } }}
                                />
                              )}
                              fieldGroups={[
                                [
                                  {
                                    label: 'Developer',
                                    value: (
                                      <ChplLink
                                        href={`#/organizations/developers/${item.developer.id}`}
                                        text={item.developer.name}
                                        analytics={{
                                          ...analytics,
                                          event: 'Navigate to Developer Page',
                                          label: item.developer.name,
                                        }}
                                        external={false}
                                        router={{ sref: 'organizations.developers.developer', options: { id: item.developer.id } }}
                                      />
                                    ),
                                    xs: 12,
                                    sm: 4,
                                  },
                                  {
                                    label: 'Product',
                                    value: item.product.name,
                                    xs: 12,
                                    sm: 4,
                                  },
                                  {
                                    label: 'Version',
                                    value: item.version.name,
                                    xs: 12,
                                    sm: 4,
                                  },
                                ],
                                [
                                  {
                                    label: '# Open Surveillance NCs',
                                    value: item.openSurveillanceNonConformityCount,
                                    xs: 4,
                                    sm: 4,
                                  },
                                  {
                                    label: '# Closed Surveillance NCs',
                                    value: item.closedSurveillanceNonConformityCount,
                                    xs: 4,
                                    sm: 4,
                                  },
                                  {
                                    label: 'Status',
                                    value: getStatusIcon(item.certificationStatus),
                                    xs: 4,
                                    sm: 4,
                                  },
                                ],
                                [
                                  {
                                    label: '# Open Direct Review NCs',
                                    value: item.openDirectReviewNonConformityCount,
                                    xs: 6,
                                    sm: 4,
                                  },
                                  {
                                    label: '# Closed Direct Review NCs',
                                    value: item.closedDirectReviewNonConformityCount,
                                    xs: 6,
                                    sm: 4,
                                  },
                                ],
                              ]}
                              actions={<ChplActionButton listing={item} />}
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
          </>
        )}
    </div>
  );
}

export default ChplCorrectiveActionSearchView;

ChplCorrectiveActionSearchView.propTypes = {
};
