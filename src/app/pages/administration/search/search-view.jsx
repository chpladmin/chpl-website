import React, { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { shape, string } from 'prop-types';
import GetAppIcon from '@material-ui/icons/GetApp';
import { ExportToCsv } from 'export-to-csv';

import { useFetchCollection } from 'api/collections';
import ChplActionButton from 'components/action-widget/action-button';
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
import { getDisplayDateFormat } from 'services/date-util';
import { useSessionStorage as useStorage } from 'services/storage.service';
import { palette, theme } from 'themes';

const csvOptions = {
  filename: 'listings',
  showLabels: true,
  headers: [
    { headerName: 'CHPL ID', objectKey: 'chplProductNumber' },
    { headerName: 'Certification Edition', objectKey: 'fullEdition' },
    { headerName: 'Developer', objectKey: 'developerName' },
    { headerName: 'Product', objectKey: 'productName' },
    { headerName: 'Version', objectKey: 'versionName' },
    { headerName: 'Certification Date', objectKey: 'certificationDate' },
    { headerName: 'Certification Status', objectKey: 'certificationStatusName' },
  ],
};

/* eslint-disable object-curly-newline */
const headers = [
  { property: 'chpl_id', text: 'CHPL ID', sortable: true },
  { text: 'Certification Edition' },
  { property: 'developer', text: 'Developer', sortable: true },
  { property: 'product', text: 'Product', sortable: true },
  { property: 'version', text: 'Version', sortable: true },
  { property: 'certification_date', text: 'Certification Date', sortable: true, reverseDefault: true },
  { text: 'Certification Status' },
  { text: 'Actions', invisible: true },
];
/* eslint-enable object-curly-newline */

const useStyles = makeStyles({
  iconSpacing: {
    marginLeft: '4px',
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

function ChplSearchView(props) {
  const storageKey = 'storageKey-searchView';
  const $analytics = getAngularService('$analytics');
  const { analytics } = props;
  const csvExporter = new ExportToCsv(csvOptions);
  const [listings, setListings] = useState([]);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'developer');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, false);
  const [recordCount, setRecordCount] = useState(0);
  const classes = useStyles();

  const filterContext = useFilterContext();
  const { data, isError, isLoading } = useFetchCollection({
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
      fullEdition: `${listing.edition.name}${listing.curesUpdate ? ' Cures Update' : ''}`,
      developerName: listing.developer.name,
      productName: listing.product.name,
      versionName: listing.version.name,
      certificationStatusName: listing.certificationStatus.name,
    })));
    setRecordCount(data.recordCount);
  }, [data?.results, data?.recordCount, isError, isLoading, analytics]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  const downloadSearch = () => {
    $analytics.eventTrack('Download Results', { category: analytics.category, label: listings.length });
    csvExporter.generateCsv(listings);
  };

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
        <Typography variant="h1">Search</Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <Typography variant="body1">
          Please note that only active and suspended listings are shown by default. Use the Certification Status / Certification Edition filters to display retired, withdrawn, terminated, or 2011 and 2014 edition listings.
        </Typography>
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
                  <ButtonGroup size="small" className={classes.wrap}>
                    <Button
                      color="secondary"
                      variant="contained"
                      fullWidth
                      id="download-filtered-listings"
                      onClick={downloadSearch}
                    >
                      Download
                      {' '}
                      { listings.length }
                      {' '}
                      Result
                      { listings.length !== 1 ? 's' : '' }
                      <GetAppIcon className={classes.iconSpacing} />
                    </Button>
                  </ButtonGroup>
                )}
            </div>
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
                              <TableCell>{ getDisplayDateFormat(item.certificationDate) }</TableCell>
                              <TableCell>{item.certificationStatus.name}</TableCell>
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

export default ChplSearchView;

ChplSearchView.propTypes = {
  analytics: shape({
    category: string.isRequired,
  }).isRequired,
};
