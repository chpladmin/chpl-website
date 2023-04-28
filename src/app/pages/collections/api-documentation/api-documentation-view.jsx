import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import Moment from 'react-moment';
import { shape, string } from 'prop-types';

import {
  useFetchApiDocumentationData,
  useFetchCollection,
} from 'api/collections';
import ChplActionButton from 'components/action-widget/action-button';
import ChplCertificationStatusLegend from 'components/certification-status/certification-status';
import ChplDownloadListings from 'components/download-listings/download-listings';
import {
  ChplLink,
  ChplPagination,
} from 'components/util';
import { ChplSortableHeaders } from 'components/util/sortable-headers';
import {
  ChplFilterChips,
  ChplFilterPanel,
  ChplFilterSearchTerm,
  useFilterContext,
} from 'components/filter';
import { getAngularService } from 'services/angular-react-helper';
import { getStatusIcon } from 'services/listing.service';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { palette, theme, utilStyles } from 'themes';

const useStyles = makeStyles({
  ...utilStyles,
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
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: '2fr 1fr',
    },
  },
  pageContent: {
    display: 'grid',
    gridTemplateRows: '3fr 1fr',
  },
  searchContainer: {
    backgroundColor: palette.grey,
    padding: '16px 32px',
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
      gridTemplateColumns: 'auto 10fr auto',
    },
  },
  stickyColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#ffffff',
    overflowWrap: 'anywhere',
    [theme.breakpoints.up('sm')]: {
      minWidth: '275px',
    },
  },
  tableContainer: {
    overflowWrap: 'normal',
    border: '.5px solid #c2c6ca',
    margin: '0px 32px',
    width: 'auto',
  },
  tableResultsHeaderContainer: {
    display: 'grid',
    gap: '8px',
    margin: '16px 32px',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.up('sm')]: {
      gridTemplateColumns: 'auto auto',
    },
  },
  resultsContainer: {
    display: 'grid',
    gap: '8px',
    justifyContent: 'start',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
  },
  wrap: {
    flexFlow: 'wrap',
  },
});

const criteriaLookup = {
  56: { display: '170.315 (g)(7)', sort: 0 },
  181: { display: '170.315 (g)(9) (Cures Update)', sort: 1 },
  182: { display: '170.315 (g)(10) (Cures Update)', sort: 2 },
};

const parseApiDocumentation = ({ apiDocumentation }, analytics) => {
  if (apiDocumentation.length === 0) { return 'N/A'; }
  const items = Object.entries(apiDocumentation
    .filter((item) => (item.criterion.id !== 57 && item.criterion.id !== 58))
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
        .sort((a, b) => criteriaLookup[a].sort - criteriaLookup[b].sort)
        .map((id) => criteriaLookup[id].display)
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
              analytics={{ event: 'Go to API Documentation Website', category: analytics.category, label: url }}
            />
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
};

function ChplApiDocumentationCollectionView(props) {
  const storageKey = 'storageKey-apiDocumentationView';
  const $analytics = getAngularService('$analytics');
  const API = getAngularService('API');
  const authService = getAngularService('authService');
  const { analytics } = props;
  const [documentationDate, setDocumentationDate] = useState('');
  const [downloadLink, setDownloadLink] = useState('');
  const [listings, setListings] = useState([]);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'developer');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, false);
  const [recordCount, setRecordCount] = useState(0);
  const classes = useStyles();
  const toggledCsvDefaults = ['apiDocumentation'];

  const filterContext = useFilterContext();
  const { data, isError, isLoading } = useFetchCollection({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query: filterContext.queryString(),
  });
  const { data: documentation } = useFetchApiDocumentationData();

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

  useEffect(() => {
    setDownloadLink(`${API}/files/api_documentation?api_key=${authService.getApiKey()}`);
  }, [API, authService]);

  useEffect(() => {
    if (!documentation?.associatedDate) { return; }
    setDocumentationDate(documentation.associatedDate);
  }, [documentation?.associatedDate]);

  /* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
  const headers = [
    { property: 'chpl_id', text: 'CHPL ID', sortable: true },
    { text: 'Certification Edition' },
    { property: 'developer', text: 'Developer', sortable: true },
    { property: 'product', text: 'Product', sortable: true },
    { property: 'version', text: 'Version', sortable: true },
    { text: 'Status', extra: <ChplCertificationStatusLegend /> },
    { text: 'API Documentation' },
    { text: 'Service Base URL List' },
    { text: 'Mandatory Disclosures URL' },
    { text: 'Actions', invisible: true },
  ];

  const handleTableSort = (event, property, orderDirection) => {
    $analytics.eventTrack('Sort', { category: analytics.category, label: property });
    setOrderBy(property);
    setSortDescending(orderDirection === 'desc');
  };

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, recordCount);

  return (
    <>
      <div className={classes.pageHeader}>
        <Typography variant="h1">API Information for 2015 Edition Products</Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <div>
          <Typography variant="body1" gutterBottom>
            This list includes all 2015 Edition, including Cures Update, health IT products that have been certified to at least one of the following API Criteria:
          </Typography>
          <ul>
            <li>&sect;170.315 (g)(7): Application Access - Patient Selection</li>
            <li>&sect;170.315 (g)(9): Application Access - All Data Request (Cures Update)</li>
            <li>&sect;170.315 (g)(10): Standardized API for Patient and Population Services (Cures Update)</li>
          </ul>
          <Typography variant="body1" gutterBottom>
            The Mandatory Disclosures URL is also provided for each health IT product in this list. This is a hyperlink to a page on the developer&apos;s official website that provides in plain language any limitations and/or additional costs associated with the implementation and/or use of the developer&apos;s certified health IT.
          </Typography>
          <Typography variant="body1">
            Please note that by default, only listings that are active or suspended are shown in the search results.
          </Typography>
        </div>
        <div>
          <h2>API Documentation Dataset</h2>
          <Typography variant="body1" gutterBottom>
            The API Documentation Dataset is derived from a manual review by ONC of developer API documentation and details the API syntax and authorization standard used for products certified to the API criteria.
          </Typography>
          <ChplLink
            href={downloadLink}
            text="Download API Documentation Dataset"
            id="download-api-documentation"
            analytics={{ event: 'Download API Documentation data', category: analytics.category }}
            external={false}
          />
          { documentationDate
            && (
              <Typography variant="body2">
                Last updated
                {' '}
                <Moment
                  fromNow
                  withTitle
                  titleFormat="DD MMM yyyy"
                >
                  {documentationDate}
                </Moment>
              </Typography>
            )}
        </div>
      </div>
      <div className={classes.searchContainer} component={Paper}>
        <ChplFilterSearchTerm />
        <ChplFilterPanel />
      </div>
      <div>
        <ChplFilterChips />
      </div>
      { isLoading
        && (
          <>Loading</>
        )}
      { !isLoading
        && (
          <>
            <div className={classes.tableResultsHeaderContainer}>
              <div className={`${classes.resultsContainer} ${classes.wrap}`}>
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
                  <ChplDownloadListings
                    analytics={analytics}
                    listings={listings}
                    toggled={toggledCsvDefaults}
                  />
                )}
            </div>
            { listings.length > 0
              && (
                <>
                  <TableContainer className={classes.tableContainer} component={Paper}>
                    <Table
                      stickyHeader
                      aria-label="API Documentation Collections table"
                    >
                      <ChplSortableHeaders
                        headers={headers}
                        onTableSort={handleTableSort}
                        orderBy={orderBy}
                        order={sortDescending ? 'desc' : 'asc'}
                        stickyHeader
                      />
                      <TableBody>
                        { listings
                          .map((item) => (
                            <TableRow key={item.id}>
                              <TableCell className={classes.stickyColumn}>
                                <strong>
                                  <ChplLink
                                    href={`#/listing/${item.id}`}
                                    text={item.chplProductNumber}
                                    analytics={{ event: 'Go to Listing Details Page', category: analytics.category, label: item.chplProductNumber }}
                                    external={false}
                                    router={{ sref: 'listing', options: { id: item.id } }}
                                  />
                                </strong>
                              </TableCell>
                              <TableCell>
                                {item.edition.name}
                                {' '}
                                {item.curesUpdate ? 'Cures Update' : '' }
                              </TableCell>
                              <TableCell>
                                <ChplLink
                                  href={`#/organizations/developers/${item.developer.id}`}
                                  text={item.developer.name}
                                  analytics={{ event: 'Go to Developer Page', category: analytics.category, label: item.developer.name }}
                                  external={false}
                                  router={{ sref: 'organizations.developers.developer', options: { id: item.developer.id } }}
                                />
                              </TableCell>
                              <TableCell>{item.product.name}</TableCell>
                              <TableCell>{item.version.name}</TableCell>
                              <TableCell>{ getStatusIcon(item.certificationStatus) }</TableCell>
                              <TableCell className={classes.linkWrap}>
                                { item.apiDocumentationNode }
                              </TableCell>
                              <TableCell className={classes.linkWrap}>
                                { item.serviceBaseUrlListValue
                                  ? (
                                    <dl>
                                      <dt>170.315 (g)(10) (Cures Update)</dt>
                                      <dd>
                                        <ChplLink
                                          href={item.serviceBaseUrlListValue}
                                          analytics={{ event: 'Go to Service Base URL List website', category: analytics.category, label: item.serviceBaseUrlListValue }}
                                        />
                                      </dd>
                                    </dl>
                                  ) : (
                                    <>N/A</>
                                  )}
                              </TableCell>
                              <TableCell className={classes.linkWrap}>
                                { item.mandatoryDisclosures
                                  ? (
                                    <ChplLink
                                      href={item.mandatoryDisclosures}
                                      analytics={{ event: 'Go to Mandatory Disclosures Website', category: analytics.category, label: item.mandatoryDisclosures }}
                                    />
                                  ) : (
                                    <>N/A</>
                                  )}
                              </TableCell>
                              <TableCell>
                                <ChplActionButton listing={item} />
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <ChplPagination
                    count={recordCount}
                    page={pageNumber}
                    rowsPerPage={pageSize}
                    rowsPerPageOptions={[25, 50, 100]}
                    setPage={setPageNumber}
                    setRowsPerPage={setPageSize}
                    analytics={analytics}
                  />
                </>
              )}
          </>
        )}
    </>
  );
}

export default ChplApiDocumentationCollectionView;

ChplApiDocumentationCollectionView.propTypes = {
  analytics: shape({
    category: string.isRequired,
  }).isRequired,
};
