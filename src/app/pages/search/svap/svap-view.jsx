import React, { useContext, useEffect, useState } from 'react';
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
import { useFetchSvaps } from 'api/standards';
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
import { getAngularService } from 'services/angular-react-helper';
import { sortCriteria } from 'services/criteria.service';
import { getStatusIcon } from 'services/listing.service';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { UserContext, useAnalyticsContext } from 'shared/contexts';
import { theme, utilStyles } from 'themes';

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

const parseSvap = ({ svaps }, data) => {
  if (svaps.length === 0) { return 'N/A'; }
  const items = svaps
    .map((item) => ({
      ...item,
      display: item.criterion.number,
      svaps: item.values.map((id) => data.find((s) => s.svapId === id)),
    }))
    .sort((a, b) => sortCriteria(a.criterion, b.criterion));
  return (
    <ul>
      {items.map((item) => (
        <React.Fragment key={`${item.criterion.id}`}>
          <li>{ item.display }</li>
          <ul>
            { item.svaps.map((svap) => (
              <li key={svap.svapId}>
                { svap.replaced ? 'Replaced | ' : '' }
                { svap.regulatoryTextCitation }
                :
                {' '}
                { svap.approvedStandardVersion }
              </li>
            ))}
          </ul>
        </React.Fragment>
      ))}
    </ul>
  );
};

/* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
const headers = [
  { property: 'chpl_id', text: 'CHPL ID', sortable: true },
  { property: 'developer', text: 'Developer', sortable: true },
  { property: 'product', text: 'Product', sortable: true },
  { property: 'version', text: 'Version', sortable: true },
  { text: 'Status', extra: <ChplCertificationStatusLegend /> },
  { text: 'SVAP Information' },
  { text: 'SVAP Notice' },
  { text: 'Actions', invisible: true },
];

function ChplSvapSearchView() {
  const storageKey = 'storageKey-svapView';
  const API = getAngularService('API');
  const authService = getAngularService('authService');
  const { analytics } = useAnalyticsContext();
  const { hasAnyRole } = useContext(UserContext);
  const [downloadLink, setDownloadLink] = useState('');
  const [listings, setListings] = useState([]);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'developer');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, false);
  const [svaps, setSvaps] = useState([]);
  const [recordCount, setRecordCount] = useState(0);
  const classes = useStyles();
  const toggledCsvDefaults = ['svap'];

  const filterContext = useFilterContext();
  const { data, isError, isLoading } = useFetchListings({
    orderBy,
    pageNumber,
    pageSize,
    sortDescending,
    query: `certificationCriteriaIds=52&${filterContext.queryString()}`,
  });
  const svapQuery = useFetchSvaps();

  useEffect(() => {
    if (isLoading || svaps.length === 0) { return; }
    if (isError || !data.results) {
      setListings([]);
      return;
    }
    setListings(data.results.map((listing) => ({
      ...listing,
      svapNode: parseSvap(listing, svaps),
    })));
    setRecordCount(data.recordCount);
  }, [data?.results, data?.recordCount, isError, isLoading, svaps]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  useEffect(() => {
    if (svapQuery.isLoading || !svapQuery.isSuccess) {
      return;
    }
    setSvaps(svapQuery.data);
  }, [svapQuery.data, svapQuery.isLoading, svapQuery.isSuccess]);

  useEffect(() => {
    setDownloadLink(`${API}/svap/download?api_key=${authService.getApiKey()}`);
  }, [API, authService]);

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
        <Typography variant="h1">SVAP Information</Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <div>
          <Typography variant="body1" gutterBottom>
            This search features Health IT Module(s) that have successfully adopted advanced interoperability standards through the
            {' '}
            <ChplLink
              href="https://www.healthit.gov/topic/standards-version-advancement-process-svap"
              text="Standards Version Advancement Process (SVAP)"
              analytics={{
                ...analytics,
                event: 'Go to Standards Version Advancement Process (SVAP)',
              }}
              external={false}
              inline
            />
            . The SVAP, introduced in the ONC&apos;s
            {' '}
            <ChplLink
              href="https://www.healthit.gov/topic/information-blocking"
              text="Cures Act Final Rule"
              analytics={{
                ...analytics,
                event: 'Go to Cures Act Final Rule',
              }}
              external={false}
              inline
            />
            , aims to streamline the adoption of newer standards, improving communication and data exchange across healthcare systems.
          </Typography>
          <Typography variant="body1" gutterBottom>
            Health IT developers participating in the ONC Health IT Certification Program are encouraged to incorporate the most up-to-date standards in their Health IT Module(s), as outlined in &sect;170.405(a) of the
            {' '}
            <ChplLink
              href="https://www.healthit.gov/topic/information-blocking"
              text="Cures Act Final Rule"
              analytics={{
                ...analytics,
                event: 'Go to Cures Act Final Rule',
              }}
              external={false}
              inline
            />
            . The SVAP Search serves as a valuable resource for healthcare providers seeking Health IT solutions that employ the latest interoperability standards.
          </Typography>
          <Typography variant="body1" gutterBottom>
            SVAP information and related data are available on the CHPL website and can also be accessed through the
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
            {' '}
            page. For more details, please visit the
            {' '}
            <ChplLink
              href="https://www.healthit.gov/topic/standards-version-advancement-process-svap"
              text="SVAP Resources"
              analytics={{
                ...analytics,
                event: 'Go to SVAP Resources',
              }}
              external={false}
              inline
            />
            .
          </Typography>
          <Typography variant="body1">
            Please note that by default, only listings that are active or suspended are shown in the search results.
          </Typography>
        </div>
        <div>
          <h2>SVAP Dataset</h2>
          <Typography variant="body1" gutterBottom>
            Entire search of SVAP values that have been associated with a criterion for a certified product. Multiple rows for a single product will appear in the file for any products containing multiple SVAP values and/or SVAP values for multiple criteria. Available as a CSV file; updated nightly.
          </Typography>
          <ChplLink
            href={downloadLink}
            text="Download SVAP Summary"
            analytics={{
              ...analytics,
              event: 'Download SVAP Summary',
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
              { listings.length > 0 && hasAnyRole(['chpl-admin', 'chpl-onc'])
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
                      aria-label="SVAP Searchs table"
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
                              <TableCell className={classes.linkWrap}>
                                { item.svapNode }
                              </TableCell>
                              <TableCell className={classes.linkWrap}>
                                { item.svapNoticeUrl
                                  ? (
                                    <ChplLink
                                      href={item.svapNoticeUrl}
                                      analytics={{
                                        ...analytics,
                                        event: 'Go to SVAP Notice',
                                        label: item.chplProductNumber,
                                        aggregationName: item.product.name,
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
                  />
                </>
              )}
          </>
        )}
    </>
  );
}

export default ChplSvapSearchView;

ChplSvapSearchView.propTypes = {
};
