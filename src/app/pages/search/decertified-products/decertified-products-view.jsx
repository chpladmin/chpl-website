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
import { getDisplayDateFormat } from 'services/date-util';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { useAnalyticsContext } from 'shared/contexts';
import { theme } from 'themes';

const sortOptions = [
  { property: 'chpl_id', text: 'CHPL ID' },
  { property: 'developer', text: 'Developer' },
  { property: 'product', text: 'Product' },
  { property: 'version', text: 'Version' },
];

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
    backgroundColor: '#ffffff',
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
    overflow: 'auto',
  },
});

function ChplDecertifiedProductsSearchView() {
  const storageKey = 'storageKey-decertifiedProductsView';
  const { analytics } = useAnalyticsContext();
  const [listings, setListings] = useState([]);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'developer');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, false);
  const [recordCount, setRecordCount] = useState(0);
  const classes = useStyles();
  const toggledCsvDefaults = ['decertificationDate'];

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
    setListings(data.results.map((listing) => ({
      ...listing,
    })));
    setRecordCount(data.recordCount);
  }, [data?.results, data?.recordCount, isError, isLoading]);

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
      <div className={classes.pageHeader}>
        <Typography variant="h1">Decertified Products</Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <Typography variant="body1" gutterBottom>
          This list includes all health IT products that have had their status changed to a &quot;decertified&quot; status on the Certified Health IT Products List (CHPL). A product may be decertified for the following reasons: certificate terminated by ONC, certificate withdrawn by an ONC-ACB, or certification withdrawn by an ONC-ACB because the health IT developer requested it to be withdrawn when the product was under ONC-ACB surveillance or ONC direct review. For further descriptions of the certification statuses, please consult the
          {' '}
          <ChplLink
            href="https://www.healthit.gov/sites/default/files/policy/chpl_public_user_guide.pdf"
            text="CHPL Public User Guide"
            analytics={{
              ...analytics,
              event: 'Go to CHPL Public User Guide',
            }}
            external={false}
            inline
          />
          . For more information on how a decertified product may affect your attestation to the CMS EHR Incentive Programs, please consult the
          {' '}
          <ChplLink
            href="https://www.cms.gov/Regulations-and-Guidance/Legislation/EHRIncentivePrograms/FAQ.html"
            text="CMS FAQ"
            analytics={{
              ...analytics,
              event: 'Go to CMS FAQ',
            }}
            external={false}
            inline
          />
          . For additional information about how a decertified product may affect your participation in other CMS programs, please reach out to that program.
        </Typography>
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
                      toggled={toggledCsvDefaults}
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
                              sm: 3,
                            },
                            {
                              label: 'Product',
                              value: item.product.name,
                              xs: 12,
                              sm: 3,
                            },
                             {
                              label: 'Version',
                              value: item.version.name,
                              xs: 12,
                              sm: 3,
                            },
                                                        {
                              label: 'Status',
                              value: getStatusIcon(item.certificationStatus),
                              xs: 12,
                              sm: 3,
                            },
                          ],
                          [
                            {
                              label: 'Decertification Date',
                              value: getDisplayDateFormat(item.decertificationDate),
                              xs: 12,
                              sm: 12,
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
    </div>
  );
}

export default ChplDecertifiedProductsSearchView;

ChplDecertifiedProductsSearchView.propTypes = {
};
