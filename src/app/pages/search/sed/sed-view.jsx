import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
} from '@material-ui/core';

import { useFetchListings } from 'api/search';
import ChplActionButton from 'components/action-widget/action-button';
import ChplCertificationStatusLegend from 'components/certification-status/certification-status';
import ChplDownloadListings from 'components/download-listings/download-listings';
import ChplSedPopup from 'components/listing/details/sed/sed-popup';
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
  ChplFilterLayout,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { eventTrack } from 'services/analytics.service';
import { getAngularService } from 'services/angular-react-helper';
import { getDisplayDateFormat } from 'services/date-util';
import { getStatusIcon } from 'services/listing.service';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { useAnalyticsContext } from 'shared/contexts';

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
    <>
      <ChplPageHeader
        text="SED Information"
        subtitle={(
          <>
            <Typography variant="body1" gutterBottom>
              This list includes all health IT products that have been certified with Safety Enhanced Design (SED). Please note that by default, only listings that are active or suspended are shown in the search results.
            </Typography>
            <Typography gutterBottom component="h2" variant="h5">SED Information Dataset</Typography>
            <Typography variant="body1" gutterBottom>
              Please note the SED Details file contains information for certified product listings and is not filtered based on search results.
              {' '}
              <ChplLink
                href={downloadLink}
                text="Download SED Details"
                analytics={{
                  ...analytics,
                  event: 'Download SED Details',
                }}
                external={false}
              />
            </Typography>
          </>
        )}
      />
      <ChplPageBody>
        <ChplFilterSearchBar sticky />
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
              <ChplDownloadListings
                listings={listings}
              />
            </ChplSearchResultControls>
            { listings.length > 0
            && (
              <>
                <Box>
                  { listings.map((item) => (
                    <ChplSearchResultCard
                      key={item.id}
                      fieldGroups={[
                        [
                          {
                            label: 'Developer',
                            style: { flex: '2 1 320px' },
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
                          },
                          {
                            label: 'Product',
                            value: item.product.name,
                          },
                          {
                            label: 'Version',
                            value: item.version.name,
                          },
                        ],
                        [
                          {
                            label: 'CHPL ID',
                            style: { flex: '2 1 320px' },
                            value: (
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
                            ),
                          },
                          {
                            label: 'Certification Date',
                            value: getDisplayDateFormat(item.certificationDate),
                          },
                          {
                            label: 'Status',
                            value: getStatusIcon(item.certificationStatus),
                            iconButton: <ChplCertificationStatusLegend />,
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
        </ChplFilterLayout>
      </ChplPageBody>
    </>
  );
}

export default ChplSedSearchView;

ChplSedSearchView.propTypes = {
};
