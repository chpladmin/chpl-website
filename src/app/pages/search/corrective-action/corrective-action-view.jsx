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

import { useFetchListings } from 'api/search';
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
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { eventTrack } from 'services/analytics.service';
import { getStatusIcon } from 'services/listing.service';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { useAnalyticsContext } from 'shared/contexts';
import { theme } from 'themes';

/* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
const headers = [
  { property: 'chpl_id', text: 'CHPL ID', sortable: true },
  { property: 'developer', text: 'Developer', sortable: true },
  { property: 'product', text: 'Product', sortable: true },
  { property: 'version', text: 'Version', sortable: true },
  { text: 'Status', extra: <ChplCertificationStatusLegend /> },
  { property: 'open_surveillance_nc_count', text: '# Open Surveillance NCs', sortable: true, reverseDefault: true },
  { property: 'closed_surveillance_nc_count', text: '# Closed Surveillance NCs', sortable: true, reverseDefault: true },
  { property: 'open_direct_review_nc_count', text: '# Open Direct Review NCs', sortable: true, reverseDefault: true },
  { property: 'closed_direct_review_nc_count', text: '# Closed Direct Review NCs', sortable: true, reverseDefault: true },
  { text: 'Actions', invisible: true },
];

const useStyles = makeStyles({
  linkWrap: {
    overflowWrap: 'anywhere',
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
  pageContent: {
    display: 'grid',
    gridTemplateRows: '3fr 1fr',
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

  const handleTableSort = (event, property, orderDirection) => {
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
      <div className={classes.pageHeader}>
        <Typography variant="h1">Products: Corrective Action Status</Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <Typography variant="body1" gutterBottom>
          This is a list of all health IT products for which a non-conformity has been recorded. A certified product is non-conforming if, at any time, an ONC-Authorized Certification Body (ONC-ACB) or ONC determines that the product does not comply with a requirement of certification. Non-conformities reported as part of surveillance are noted as &quot;Surveillance NCs&quot;, while non-conformities identified though an ONC Direct Review are noted as &quot;Direct Review NCs&quot;. Not all non-conformities affect a product&apos;s functionality, and the existence of a non-conformity does not by itself mean that a product is &quot;defective.&quot; Developers of certified products are required to notify customers of non-conformities and must take approved corrective actions to address such non-conformities in a timely and effective manner. Detailed information about non-conformities, and associated corrective action plans, can be accessed below by clicking on the product&apos;s CHPL ID.
        </Typography>
        <Typography variant="body1">
          Please note that by default, only listings that are active or suspended are shown in the search results.
        </Typography>
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
                            aria-label="Corrective Action Searchs table"
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
                                          analytics={{
                                            ...analytics,
                                            event: 'Navigate to Listing Details Page',
                                            label: item.chplProductNumber,
                                            aggregationName: item.product.name,
                                          }}
                                          external={false}
                                          router={{ sref: 'listing', options: { id: item.id } }}
                                        />
                                      </strong>
                                    </TableCell>
                                    <TableCell>
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
                                    </TableCell>
                                    <TableCell>{item.product.name}</TableCell>
                                    <TableCell>{item.version.name}</TableCell>
                                    <TableCell>{ getStatusIcon(item.certificationStatus) }</TableCell>
                                    <TableCell>{item.openSurveillanceNonConformityCount}</TableCell>
                                    <TableCell>{item.closedSurveillanceNonConformityCount}</TableCell>
                                    <TableCell>{item.openDirectReviewNonConformityCount}</TableCell>
                                    <TableCell>{item.closedDirectReviewNonConformityCount}</TableCell>
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
                        />
                      </>
                    )}
                </>
              )}
          </>
        )}
    </>
  );
}

export default ChplCorrectiveActionSearchView;

ChplCorrectiveActionSearchView.propTypes = {
};
