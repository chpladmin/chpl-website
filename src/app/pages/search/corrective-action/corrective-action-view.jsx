import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
} from '@material-ui/core';

import { useFetchListings } from 'api/search';
import ChplActionButton from 'components/action-widget/action-button';
import ChplDownloadListings from 'components/download-listings/download-listings';
import {
  ChplLink,
  ChplLoadingCards,
  ChplPagination,
  ChplPageBody,
  ChplPageHeader,
  ChplSearchResultCard,
  ChplSearchResultControls,
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
    <>
      <ChplPageHeader
        text="Products: Corrective Action Status"
        subtitle={(
          <>
            <Typography variant="body1" gutterBottom>
              This is a list of all health IT products for which a non-conformity has been recorded. A certified product is non-conforming if, at any time, an ONC-Authorized Certification Body (ONC-ACB) or ONC determines that the product does not comply with a requirement of certification. Non-conformities reported as part of surveillance are noted as &quot;Surveillance NCs&quot;, while non-conformities identified though an ONC Direct Review are noted as &quot;Direct Review NCs&quot;.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Not all non-conformities affect a product&apos;s functionality, and the existence of a non-conformity does not by itself mean that a product is &quot;defective.&quot; Developers of certified products are required to notify customers of non-conformities and must take approved corrective actions to address such non-conformities in a timely and effective manner. Detailed information about non-conformities, and associated corrective action plans, can be accessed below by clicking on the product&apos;s CHPL ID.
            </Typography>
            <Typography variant="body1" gutterBottom>
              Please note that by default, only listings that are active or suspended are shown in the search results.
            </Typography>
          </>
        )}
      />
      <ChplPageBody>
        <div id="main-content" tabIndex="-1">
          { !isLoading && !directReviewsAvailable
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
        </div>
        { directReviewsAvailable
        && (
          <>
            <ChplFilterSearchBar />
            <div>
              <ChplFilterChips />
            </div>
            {isLoading && (<ChplLoadingCards />)}
            {!isLoading
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
                    <ChplDownloadListings
                      listings={listings}
                      toggled={toggledCsvDefaults}
                    />
                  </ChplSearchResultControls>
                  {listings.length > 0
                    && (
                      <>
                        <Box>
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
                                    label: '# Open Surveillance NCs',
                                    value: item.openSurveillanceNonConformityCount,
                                    xs: 6,
                                    sm: 3,
                                  },
                                  {
                                    label: '# Closed Surveillance NCs',
                                    value: item.closedSurveillanceNonConformityCount,
                                    xs: 6,
                                    sm: 3,
                                  },
                                  {
                                    label: '# Open Direct Review NCs',
                                    value: item.openDirectReviewNonConformityCount,
                                    xs: 6,
                                    sm: 3,
                                  },
                                  {
                                    label: '# Closed Direct Review NCs',
                                    value: item.closedDirectReviewNonConformityCount,
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
          </>
        )}
      </ChplPageBody>
    </>
  );
}

export default ChplCorrectiveActionSearchView;

ChplCorrectiveActionSearchView.propTypes = {
};
