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
import ChplSedPopup from 'components/listing/details/sed/sed-popup';
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
import { getAngularService } from 'services/angular-react-helper';
import { getStatusIcon } from 'services/listing.service';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { useAnalyticsContext } from 'shared/contexts';
import { theme } from 'themes';

const useStyles = makeStyles({
  fixFooterSpacing: {
    minHeight: 'calc(100vh - 158px)',
  },
  pageHeader: {
    padding: '32px',
    backgroundColor: '#ffffff',
  },
  pageBody: {
    display: 'grid',
    gap: '16px',
    padding: '16px 32px',
    backgroundColor: '#f9f9f9',
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

/* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
const sortOptions = [
  { property: 'chpl_id', text: 'CHPL ID' },
  { property: 'developer', text: 'Developer' },
  { property: 'product', text: 'Product' },
  { property: 'version', text: 'Version' },
];

function ChplSedSearchView() {
  const storageKey = 'storageKey-sedView';
  const API = getAngularService('API');
  const authService = getAngularService('authService');
  const { analytics } = useAnalyticsContext();
  const [downloadLink, setDownloadLink] = useState('');
  const [listings, setListings] = useState([]);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'developer');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, false);
  const [recordCount, setRecordCount] = useState(0);
  const classes = useStyles();

  const filterContext = useFilterContext();
  const { data, isError, isLoading } = useFetchListings({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query: `certificationCriteriaIds=52&${filterContext.queryString()}`,
  });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data.results) {
      setListings([]);
      return;
    }
    setListings(data.results.map((listing) => ({
      ...listing,
      fullEdition: listing.edition ? `${listing.edition.name}${listing.curesUpdate ? ' Cures Update' : ''}` : '',
    })));
    setRecordCount(data.recordCount);
  }, [data?.results, data?.recordCount, isError, isLoading]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  useEffect(() => {
    setDownloadLink(`${API}/certified_products/sed_details?api_key=${authService.getApiKey()}`);
  }, [API, authService]);

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
        <Typography variant="h1">SED Information</Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <div>
          <Typography variant="body1">
            This list includes all health IT products that have been certified with Safety Enhanced Design (SED).
          </Typography>
          <Typography variant="body1">
            Please note that by default, only listings that are active or suspended are shown in the search results.
          </Typography>
        </div>
        <div>
          <h2>SED Information Dataset</h2>
          <Typography variant="body1" gutterBottom>
            Please note the SED Details file contains information for certified product listings and is not filtered based on search results.
          </Typography>
          <ChplLink
            href={downloadLink}
            text="Download SED Details"
            analytics={{
              ...analytics,
              event: 'Download SED Details',
            }}
            external={false}
          />
        </div>
      </div>
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
                              sm: 6,
                            },
                            {
                              label: 'Product',
                              value: item.product.name,
                              xs: 12,
                              sm: 6,
                            },
                          ],
                          [
                            {
                              label: 'Version',
                              value: item.version.name,
                              xs: 12,
                              sm: 6,
                            },
                            {
                              label: 'Status',
                              value: getStatusIcon(item.certificationStatus),
                              xs: 12,
                              sm: 6,
                            },
                          ],
                        ]}
                        actions={(
                          <ChplActionButton
                            listing={item}
                          >
                            <ChplSedPopup
                              id={item.id}
                            />
                          </ChplActionButton>
                        )}
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
    </div>
  );
}

export default ChplSedSearchView;

ChplSedSearchView.propTypes = {
};
