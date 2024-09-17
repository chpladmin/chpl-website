import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
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
} from 'components/util';
import { ChplSortableHeaders } from 'components/util/sortable-headers';
import {
  ChplFilterChips,
  ChplFilterSearchBar,
  useFilterContext,
} from 'components/filter';
import { eventTrack } from 'services/analytics.service';
import { getStatusIcon } from 'services/listing.service';
import { getDisplayDateFormat } from 'services/date-util';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { analyticsConfig } from 'shared/prop-types';
import { palette, theme } from 'themes';

/* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
const headers = [
  { property: 'chpl_id', text: 'CHPL ID', sortable: true },
  { property: 'developer', text: 'Developer', sortable: true },
  { property: 'product', text: 'Product', sortable: true },
  { property: 'version', text: 'Version', sortable: true },
  { property: 'certification_date', text: 'Certification Date', sortable: true, reverseDefault: true },
  { text: 'Status', extra: <ChplCertificationStatusLegend /> },
  { text: 'Actions', invisible: true },
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
    margin: '0 32px',
    border: `1px solid ${palette.greyMain}`,
  },
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
  searchButtonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gridGap: '8px',
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

function ChplListingsView({ analytics }) {
  const storageKey = 'storageKey-listingsView';
  const [directReviewsAvailable, setDirectReviewsAvailable] = useState(true);
  const [listings, setListings] = useState([]);
  const [searchTermRecordCount, setSearchTermRecordCount] = useState(undefined);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'developer');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, false);
  const [recordCount, setRecordCount] = useState(0);
  const classes = useStyles();

  const { dispatch, hasSearched, queryString } = useFilterContext();
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
  }, [data?.directReviewsAvailable, data?.results, data?.recordCount, data?.searchTeramRecordCount, isError, isLoading]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  useEffect(() => {
    dispatch('setFilterDisability', 'hasHadComplianceActivity', !directReviewsAvailable);
    dispatch('setFilterDisability', 'nonConformityOptions', !directReviewsAvailable);
  }, [directReviewsAvailable]);

  const handleTableSort = (event, property, orderDirection) => {
    eventTrack({
      event: 'Sort Column',
      category: analytics.category,
      label: `${property} - ${orderDirection === 'desc' ? 'DESC' : 'ASC'}`,
      group: analytics.group,
    });
    setOrderBy(property);
    setSortDescending(orderDirection === 'desc');
  };

  const seeAllResults = () => {
    dispatch('seeAllTextSearchResults');
  };

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, recordCount);

  if (!hasSearched) {
    return <ChplLandingPage />;
  }

  return (
    <>
      <div className={classes.pageHeader}>
        <Typography variant="h1">CHPL Listings</Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <Typography variant="body1">
          Please note that only active and suspended listings are shown by default. Use the Certification Status filter to display retired, withdrawn, or terminated listings.
        </Typography>
      </div>
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
                    analytics={analytics}
                    listings={listings}
                  />
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
                  <TableContainer className={classes.tableContainer} component={Paper}>
                    <Table
                      stickyHeader
                      aria-label="Search results table"
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
                                      event: 'Navigate to Listing Details Page',
                                      category: analytics.category,
                                      label: item.chplProductNumber,
                                      aggregationName: item.product.name,
                                      group: analytics.group,
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
                                    event: 'Navigate to Developer Page',
                                    category: analytics.category,
                                    label: item.developer.name,
                                    group: analytics.group,
                                  }}
                                  external={false}
                                  router={{ sref: 'organizations.developers.developer', options: { id: item.developer.id } }}
                                />
                              </TableCell>
                              <TableCell>{item.product.name}</TableCell>
                              <TableCell>{item.version.name}</TableCell>
                              <TableCell>{ getDisplayDateFormat(item.certificationDate) }</TableCell>
                              <TableCell>{ getStatusIcon(item.certificationStatus) }</TableCell>
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

export default ChplListingsView;

ChplListingsView.propTypes = {
  analytics: analyticsConfig.isRequired,
};
