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
import ChplCompareButton from 'components/compare-widget/compare-button';
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
import { useSessionStorage as useStorage } from 'services/storage.service';
import { palette, theme } from 'themes';

const csvOptions = {
  filename: 'corrective-action',
  showLabels: true,
  headers: [
    { headerName: 'CHPL ID', objectKey: 'chplProductNumber' },
    { headerName: 'Certification Edition', objectKey: 'fullEdition' },
    { headerName: 'Developer', objectKey: 'developerName' },
    { headerName: 'Product', objectKey: 'productName' },
    { headerName: 'Version', objectKey: 'versionName' },
    { headerName: 'Certification Status', objectKey: 'certificationStatusName' },
    { headerName: '# Open Surveillance NCs', objectKey: 'openSurveillanceNonConformityCount' },
    { headerName: '# Closed Surveillance NCs', objectKey: 'closedSurveillanceNonConformityCount' },
    { headerName: '# Open Direct Review NCs', objectKey: 'openDirectReviewNonConformityCount' },
    { headerName: '# Closed Direct Review NCs', objectKey: 'closedDirectReviewNonConformityCount' },
  ],
};

/* eslint-disable object-curly-newline */
const headers = [
  { property: 'chpl_id', text: 'CHPL ID', sortable: true },
  { text: 'Certification Edition' },
  { property: 'developer', text: 'Developer', sortable: true },
  { property: 'product', text: 'Product', sortable: true },
  { property: 'version', text: 'Version', sortable: true },
  { text: 'Certification Status' },
  { property: 'open_surveillance_nc_count', text: '# Open Surveillance NCs', sortable: true, reverseDefault: true },
  { property: 'closed_surveillance_nc_count', text: '# Closed Surveillance NCs', sortable: true, reverseDefault: true },
  { property: 'open_direct_review_nc_count', text: '# Open Direct Review NCs', sortable: true, reverseDefault: true },
  { property: 'closed_direct_review_nc_count', text: '# Closed Direct Review NCs', sortable: true, reverseDefault: true },
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

const getPanel = (listing) => {
  const surv = listing.openSurveillanceNonConformityCount > 0 || listing.closedSurveillanceNonConformityCount > 0;
  const dr = listing.openDirectReviewNonConformityCount > 0 || listing.closedDirectReviewNonConformityCount > 0;
  if (surv && dr) {
    return 'compliance';
  }
  if (surv) {
    return 'surveillance';
  }
  if (dr) {
    return 'directReviews';
  }
  return 'compliance';
};

function ChplCorrectiveActionCollectionView(props) {
  const storageKey = 'storageKey-correctiveActionView';
  const $analytics = getAngularService('$analytics');
  const { analytics } = props;
  const csvExporter = new ExportToCsv(csvOptions);
  const [directReviewsAvailable, setDirectReviewsAvailable] = useState(true);
  const [listings, setListings] = useState([]);
  const [orderBy, setOrderBy] = useStorage(`${storageKey}-orderBy`, 'open_surveillance_nc_count');
  const [pageNumber, setPageNumber] = useStorage(`${storageKey}-pageNumber`, 0);
  const [pageSize, setPageSize] = useStorage(`${storageKey}-pageSize`, 25);
  const [sortDescending, setSortDescending] = useStorage(`${storageKey}-sortDescending`, true);
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
    setDirectReviewsAvailable(data?.directReviewsAvailable);
    setListings(data.results.map((listing) => ({
      ...listing,
      fullEdition: `${listing.edition.name}${listing.curesUpdate ? ' Cures Update' : ''}`,
      developerName: listing.developer.name,
      productName: listing.product.name,
      versionName: listing.version.name,
      certificationStatusName: listing.certificationStatus.name,
      panel: getPanel(listing),
    })));
    setRecordCount(data.recordCount);
  }, [data?.directReviewsAvailable, data?.results, data?.recordCount, isError, isLoading, analytics]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  const downloadListings = () => {
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
                <a href="#/resources/download">Download the CHPL page</a>
              </Typography>
            </>
          )}
      </div>
      { directReviewsAvailable
        && (
          <>
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
                            onClick={downloadListings}
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
                            aria-label="Corrective Action Collections table"
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
                                          href={`#/listing/${item.id}?panel=${item.panel}`}
                                          text={item.chplProductNumber}
                                          analytics={{ event: 'Go to Listing Details Page', category: analytics.category, label: item.chplProductNumber }}
                                          external={false}
                                          router={{ sref: 'listing', options: { id: item.id, panel: item.panel } }}
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
                                    <TableCell>{item.certificationStatus.name}</TableCell>
                                    <TableCell>{item.openSurveillanceNonConformityCount}</TableCell>
                                    <TableCell>{item.closedSurveillanceNonConformityCount}</TableCell>
                                    <TableCell>{item.openDirectReviewNonConformityCount}</TableCell>
                                    <TableCell>{item.closedDirectReviewNonConformityCount}</TableCell>
                                    <TableCell>
                                      <ChplCompareButton listing={item} />
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
        )}
    </>
  );
}

export default ChplCorrectiveActionCollectionView;

ChplCorrectiveActionCollectionView.propTypes = {
  analytics: shape({
    category: string.isRequired,
  }).isRequired,
};
