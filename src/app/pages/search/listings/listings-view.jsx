import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  makeStyles,
} from '@material-ui/core';
import FindReplaceIcon from '@material-ui/icons/FindReplace';

import ChplLandingPage from './landing-page';

import { useFetchListings } from 'api/search';
import ChplActionButton from 'components/action-widget/action-button';
import ChplCertificationStatusLegend from 'components/certification-status/certification-status';
import ChplDownloadListings from 'components/download-listings/download-listings';
import { 
  ChplLink,
  ChplPagination,
  ChplPageBody,
  ChplPageHeader,
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
import { getDisplayDateFormat } from 'services/date-util';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { useAnalyticsContext } from 'shared/contexts';
import { palette, theme } from 'themes';

/* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
const sortOptions = [
  { property: 'chpl_id', text: 'CHPL ID', sortable: true },
  { property: 'developer', text: 'Developer', sortable: true },
  { property: 'product', text: 'Product', sortable: true },
  { property: 'version', text: 'Version', sortable: true },
  { property: 'certification_date', text: 'Certification Date', sortable: true, reverseDefault: true },
];

const useStyles = makeStyles({
  cantFindContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cantFindContainer: {
    display: 'flex',
    alignItems: 'center',
    padding: 8,
    justifyContent: 'center',
    flexDirection: 'column',
    width: 'auto',
    borderRadius: '4px',
    border: `1px solid ${palette.greyMain}`,
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
    borderRadius: '0px 0px 8px 8px',
    boxShadow: `0px 2px 4px -1px ${theme.palette.grey[300]}, 0px 4px 5px 0px ${theme.palette.grey[300]}, 0px 1px 10px 0px ${theme.palette.grey[300]}`,
  },
  resultsContainer: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  cardsContainer: {
    margin: '0px -8px',
  },
});

function ChplListingsView() {
  const storageKey = 'storageKey-listingsView';
  const { analytics } = useAnalyticsContext();
  const [directReviewsAvailable, setDirectReviewsAvailable] = useState(true);
  const [listings, setListings] = useState([]);
  const [searchTermRecordCount, setSearchTermRecordCount] = useState(undefined);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'developer');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, false);
  const [recordCount, setRecordCount] = useState(0);
  const { dispatch, hasSearched, queryString, filters } = useFilterContext();
  const classes = useStyles();

  const { data, isError, isLoading } = useFetchListings({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query: queryString(),
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
    setSearchTermRecordCount(data.searchTermRecordCount);
  }, [data?.directReviewsAvailable, data?.results, data?.recordCount, data?.searchTermRecordCount, isError, isLoading]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  useEffect(() => {
    dispatch('setFilterDisability', 'hasHadComplianceActivity', !directReviewsAvailable);
    dispatch('setFilterDisability', 'nonConformityOptions', !directReviewsAvailable);
  }, [directReviewsAvailable]);

  const seeAllResults = () => {
    dispatch('seeAllTextSearchResults');
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

  if (!hasSearched) {
    return <ChplLandingPage />;
  }

  return (
    <>
      <ChplPageHeader
        text="CHPL Listings"
        subtitle="Please note that only active and suspended listings are shown by default. Use the Certification Status filter to display retired, withdrawn, or terminated listings."
      />
      <ChplPageBody>
        <div id="main-content" tabIndex="-1" />
        <ChplFilterSearchBar />
        <div>
          <ChplFilterChips />
        </div>
        { isLoading
          && (
            <Box display="flex" justifyContent="center" alignItems="center" style={{ minHeight: '200px' }}>
              <CircularProgress />
            </Box>
        )}
        { !isLoading
          && (
            <>
              <div className={classes.resultsHeaderContainer}>
                <div className={classes.resultsContainer}>
                  <Typography variant="subtitle2">Search Results:</Typography>
                  { listings.length === 0
                    && (
                      <Typography>
                        No results found
                      </Typography>
                    )}
                  { listings.length > 0
                    && (
                      <Typography variant="body2">
                        {`(${pageStart}-${pageEnd} of ${recordCount} Results)`}
                      </Typography>
                    )}
                </div>
                { listings.length > 0
                  && (
                    <Box display="flex" alignItems="center" gap={2}>
                      <ChplCertificationStatusLegend />
                      <ChplSortControls
                        sortOptions={sortOptions}
                        orderBy={orderBy}
                        order={sortDescending ? 'desc' : 'asc'}
                        onSort={handleSort}
                      />
                      <ChplDownloadListings
                        listings={listings}
                      />
                    </Box>
                  )}
              </div>
              { listings.length === 0 && searchTermRecordCount > 0
                && (
                  <Box className={classes.cantFindContainer}>
                    <FindReplaceIcon htmlColor={palette.primaryLight} style={{ fontSize: '64px' }} />
                    <Box className={classes.cantFindContent}>
                      <Typography>Can&apos;t find what you&apos;re looking for?</Typography>
                      <Button
                        onClick={seeAllResults}
                        variant="text"
                        color="primary"
                        style={{ paddingLeft: '4px',
                          paddingRight: '4px',
                          textTransform: 'none' }}
                      >
                        { `Clear filters to see ${searchTermRecordCount} more` }
                      </Button>
                    </Box>
                  </Box>
                )}
              { listings.length > 0
                && (
                  <>
                    <Box className={classes.cardsContainer}>
                      { listings.map((item) => (
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
                              inline
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
                                    inline
                                    router={{ sref: 'organizations.developers.developer', options: { id: item.developer.id } }}
                                  />
                                ),
                                xs: 6,
                                sm: 3,
                              },
                              {
                                label: 'Product',
                                value: item.product.name,
                                xs: 6,
                                sm: 3,
                              },
                              {
                                label: 'Version',
                                value: item.version.name,
                                xs: 6,
                                sm: 3,
                              },
                              {
                                label: 'Status',
                                value: getStatusIcon(item.certificationStatus),
                                xs: 6,
                                sm: 3,
                              },
                            ],
                            [
                              {
                                label: 'Certification Date',
                                value: getDisplayDateFormat(item.certificationDate),
                                xs: 6,
                                sm: 3,
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
      </ChplPageBody>
    </>
  );
}

export default ChplListingsView;

ChplListingsView.propTypes = {
};
