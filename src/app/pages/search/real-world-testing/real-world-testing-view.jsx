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

/* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
const headers = [
  { property: 'chpl_id', text: 'CHPL ID', sortable: true },
  { property: 'developer', text: 'Developer', sortable: true },
  { property: 'product', text: 'Product', sortable: true },
  { property: 'version', text: 'Version', sortable: true },
  { text: 'Status', extra: <ChplCertificationStatusLegend /> },
  { text: 'Real World Testing Plans URL' },
  { text: 'Real World Testing Results URL' },
  { text: 'Actions', invisible: true },
];

function ChplRealWorldTestingSearchView() {
  const storageKey = 'storageKey-realWorldTestingView';
  const { analytics } = useAnalyticsContext();
  const [listings, setListings] = useState([]);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'developer');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, false);
  const [recordCount, setRecordCount] = useState(0);
  const classes = useStyles();
  const toggledCsvDefaults = ['rwt'];

  const filterContext = useFilterContext();
  const { data, isError, isLoading } = useFetchListings({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query: filterContext.queryString(),
  });

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

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

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, recordCount);

  return (
    <>
      <div className={classes.pageHeader}>
        <Typography variant="h1">Real World Testing</Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <Typography
          variant="body1"
        >
          This list includes Health IT Module(s) eligible for Real World Testing, which is an annual
          {' '}
          <ChplLink
            href="https://www.healthit.gov/topic/certification-ehrs/conditions-maintenance-certification"
            text="Condition and Maintenance of Certification requirement"
            analytics={{
              event: 'Go to Condition and Maintenance of Certification requirement',
              category: analytics.category,
              group: analytics.group,
            }}
            external={false}
            inline
          />
          {' '}
          for health IT developers participating in the ONC Health IT Certification Program. Certified Health IT Developers with one or more Health IT Module(s) certified to any of the certification criteria outlined in &sect;170.405(a) of
          {' '}
          <ChplLink
            href="https://www.healthit.gov/curesrule/"
            text="ONC&apos;s Cures Act Final Rule"
            analytics={{
              event: 'Go to ONC&apos;s Cures Act Final Rule',
              category: analytics.category,
              group: analytics.group,
            }}
            external={false}
            inline
          />
          {' '}
          must successfully test their real world use.
        </Typography>
        <Typography
          variant="body1"
        >
          If applicable, Real World Testing plans are required to be made publicly available on the CHPL annually by December 15th. Additionally, Real World Testing results are to be made publicly available on the CHPL by March 15th of the subsequent year.
        </Typography>
        <Typography
          variant="body1"
        >
          For more information, please visit the
          {' '}
          <ChplLink
            href="https://www.healthit.gov/topic/certification-ehrs/real-world-testing"
            text="Real World Testing resources"
            analytics={{
              event: 'Go to Real World Testing resources',
              category: analytics.category,
              group: analytics.group,
            }}
            external={false}
            inline
          />
          . Real World Testing summary data is also available through
          {' '}
          <ChplLink
            href="#/resources/download"
            text="Download the CHPL"
            analytics={{
              event: 'Navigate to Download the CHPL',
              category: analytics.category,
              group: analytics.group,
            }}
            external={false}
            router={{ sref: 'resources.download' }}
            inline
          />
          .
        </Typography>
        <Typography
          variant="body1"
        >
          Please note that by default, only listings that are active or suspended are shown in the search results.
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
                    <Typography className={classes.noResultsContainer}>
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
                      aria-label="Real World Testing Searchs table"
                    >
                      <ChplSortableHeaders
                        headers={headers}
                        onTableSort={handleTableSort}
                        orderBy={orderBy}
                        order={sortDescending ? 'desc' : 'asc'}
                        stickyHeader
                      />
                      <TableBody>
                        {listings
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
                              <TableCell>{ getStatusIcon(item.certificationStatus) }</TableCell>
                              <TableCell className={classes.linkWrap}>
                                {item.rwtPlansUrl
                                && (
                                  <ChplLink
                                    href={item.rwtPlansUrl}
                                    analytics={{
                                      event: 'Go to Real World Testing Plans URL',
                                      category: analytics.category,
                                      label: item.chplProductNumber,
                                      aggregationName: item.product.name,
                                      group: analytics.group,
                                    }}
                                  />
                                )}
                              </TableCell>
                              <TableCell className={classes.linkWrap}>
                                {item.rwtResultsUrl
                                  ? (
                                    <ChplLink
                                      href={item.rwtResultsUrl}
                                      analytics={{
                                        event: 'Go to Real World Testing ResultsURL',
                                        category: analytics.category,
                                        label: item.chplProductNumber,
                                        aggregationName: item.product.name,
                                        group: analytics.group,
                                      }}
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

export default ChplRealWorldTestingSearchView;

ChplRealWorldTestingSearchView.propTypes = {
};
