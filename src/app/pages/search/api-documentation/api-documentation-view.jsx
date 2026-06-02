import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { arrayOf, object } from 'prop-types';

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

const criteriaLookup = {
  56: { display: '170.315 (g)(7)', sort: 0 },
  57: { display: 'Removed | 170.315 (g)(8)', sort: 1 },
  58: { display: 'Removed | 170.315 (g)(9)', sort: 2 },
  181: { display: '170.315 (g)(9)', sort: 3 },
  182: { display: '170.315 (g)(10)', sort: 4 },
  212: { display: '170.315 (g)(31)', sort: 5 },
  213: { display: '170.315 (g)(32)', sort: 6 },
  214: { display: '170.315 (g)(33)', sort: 7 },
};


const parseApiDocumentation = ({ apiDocumentation, chplProductNumber, product }, analytics) => {
  if (apiDocumentation.length === 0) { return 'N/A'; }
  const items = Object.entries(apiDocumentation
    .filter((item) => (!item.criterion.removed))
    .map((item) => ({
      id: item.criterion.id,
      url: item.value,
    }))
    .reduce((map, { id, url }) => ({
      ...map,
      [url]: (map[url] || []).concat(id),
    }), {}))
    .map(([url, ids]) => ({
      url,
      criteria: ids
        .sort((a, b) => criteriaLookup[a]?.sort - criteriaLookup[b]?.sort)
        .map((id) => criteriaLookup[id]?.display)
        .join(', '),
    }))
    .sort((a, b) => (a.criteria < b.criteria ? -1 : 1));
  return (
    <dl>
      {items.map(({ url, criteria }) => (
        <React.Fragment key={url}>
          <dt>{ criteria }</dt>
          <dd>
            <ChplLink
              key={url}
              href={url}
              analytics={{
                ...analytics,
                event: 'Go to API Documentation',
                label: chplProductNumber,
                aggregationName: product.name,
              }}
            />
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
};

function ChplApiDocumentationSearchView({ displayCriteria }) {
  const storageKey = 'storageKey-apiDocumentationView';
  const { analytics } = useAnalyticsContext();
  const [listings, setListings] = useState([]);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'developer');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, false);
  const [recordCount, setRecordCount] = useState(0);
  const classes = useStyles();
  const toggledCsvDefaults = ['apiDocumentation'];

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
      apiDocumentationNode: parseApiDocumentation(listing, analytics),
      serviceBaseUrlListValue: listing.serviceBaseUrlList?.value || '',
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
        text="API Information"
        subtitle={(
          <>
            This list includes all health IT products that have been certified to at least one of the following API Criteria.
            <br />
            Please note that by default, only listings that are active or suspended are shown in the search results.
          <ul>
          { displayCriteria.map((cc) => (
            <li key={cc.id}>
              {`§${cc.longDisplay}`}
            </li>
          ))}
        </ul>
        <Typography variant="body1" gutterBottom>
          The Mandatory Disclosures URL is also provided for each health IT product in this list. This is a hyperlink to a page on the developer&apos;s official website that provides in plain language any limitations and/or additional costs associated with the implementation and/or use of the developer&apos;s certified health IT.
        </Typography>
          </>
        )}
      />
      <ChplPageBody>
        <div id="main-content" tabIndex="-1">
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
                              xs: 6,
                              sm: 3
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
                              label: 'API Documentation',
                              value: item.apiDocumentationNode,
                              xs: 6,
                              sm: 3,
                            },
                            {
                              label: 'Service Base URL List',
                              value: item.serviceBaseUrlListValue
                                ? (
                                  <dl>
                                    <dt>170.315 (g)(10)</dt>
                                    <dd>
                                      <ChplLink
                                        href={item.serviceBaseUrlListValue}
                                        analytics={{
                                          ...analytics,
                                          event: 'Go to Service Base URL List',
                                          label: item.chplProductNumber,
                                          aggregationName: item.product.name,
                                        }}
                                      />
                                    </dd>
                                  </dl>
                                )
                                : 'N/A',
                              xs: 4,
                              sm: 4,
                            },
                            {
                              label: 'Mandatory Disclosures URL',
                              value: item.mandatoryDisclosures
                                ? (
                                  <ChplLink
                                    href={item.mandatoryDisclosures}
                                    analytics={{
                                      ...analytics,
                                      event: 'Go to Mandatory Disclosures',
                                      label: item.chplProductNumber,
                                      aggregationName: item.product.name,
                                    }}
                                  />
                                )
                                : 'N/A',
                              xs: 4,
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
        </div>
      </ChplPageBody>
    </>
  );
}

export default ChplApiDocumentationSearchView;

ChplApiDocumentationSearchView.propTypes = {
  displayCriteria: arrayOf(object).isRequired,
};
