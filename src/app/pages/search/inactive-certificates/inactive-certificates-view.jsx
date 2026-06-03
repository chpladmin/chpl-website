import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
} from '@material-ui/core';

import { useFetchListings } from 'api/search';
import ChplActionButton from 'components/action-widget/action-button';
import ChplCertificationStatusLegend from 'components/certification-status/certification-status';
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
import { getDisplayDateFormat } from 'services/date-util';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { useAnalyticsContext } from 'shared/contexts';

const sortOptions = [
  { property: 'chpl_id', text: 'CHPL ID' },
  { property: 'developer', text: 'Developer' },
  { property: 'product', text: 'Product' },
  { property: 'version', text: 'Version' },
];

function ChplInactiveCertificatesSearchView() {
  const storageKey = 'storageKey-inactiveCertificatesView';
  const { analytics } = useAnalyticsContext();
  const [listings, setListings] = useState([]);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'developer');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, false);
  const [recordCount, setRecordCount] = useState(0);
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
  }, [data?.results, data?.recordCount, isError, isLoading, analytics]);

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
        text="Inactive Certificates"
        subtitle={(
          <>
            <Typography variant="body1" gutterBottom>
              This list includes all health IT products that have had their status changed to an &quot;inactive&quot; status on the Certified Health IT Products List (CHPL). This may be simply because the developer no longer supports the product or for other reasons that are not in response to ONC-ACB surveillance, ONC direct review, or a finding of non-conformity. For further descriptions of the certification statuses, please consult the
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
              . For more information on how an inactive certificate may affect your attestation to the CMS EHR Incentive Programs, please consult the
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
              .
            </Typography>
            <Typography variant="body1" gutterBottom>
              For additional information about how an inactive certificate may affect your participation in other CMS programs, please reach out to that program.
            </Typography>
          </>
        )}
      />
      <ChplPageBody>
        <div id="main-content" tabIndex="-1" />
        <ChplFilterSearchBar />
        <div>
          <ChplFilterChips />
        </div>
        { isLoading && (<ChplLoadingCards />)}
        { !isLoading
          && (
            <>
              <ChplSearchResultControls
                recordCount={recordCount}
                pageStart={pageStart}
                pageEnd={pageEnd}
              >
                <ChplCertificationStatusLegend />
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
              { listings.length > 0
              && (
                <>
                  <Box>
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
                              sm: 6,
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

export default ChplInactiveCertificatesSearchView;

ChplInactiveCertificatesSearchView.propTypes = {
};
