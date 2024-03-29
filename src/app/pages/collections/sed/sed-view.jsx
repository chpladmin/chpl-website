import React, { useContext, useEffect, useState } from 'react';
import {
  Button,
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
import InfoIcon from '@material-ui/icons/Info';

import { useFetchCollection } from 'api/collections';
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
import { FlagContext } from 'shared/contexts';
import { palette, theme } from 'themes';

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

/* eslint object-curly-newline: ["error", { "minProperties": 5, "consistent": true }] */
const initialHeaders = [
  { property: 'chpl_id', text: 'CHPL ID', sortable: true },
  { text: 'Certification Edition' },
  { property: 'developer', text: 'Developer', sortable: true },
  { property: 'product', text: 'Product', sortable: true },
  { property: 'version', text: 'Version', sortable: true },
  { text: 'Status', extra: <ChplCertificationStatusLegend /> },
  { text: 'Actions', invisible: true },
];

function ChplSedCollectionView(props) {
  const storageKey = 'storageKey-sedView';
  const $analytics = getAngularService('$analytics');
  const $uibModal = getAngularService('$uibModal');
  const API = getAngularService('API');
  const authService = getAngularService('authService');
  const { analytics } = props;
  const { isOn } = useContext(FlagContext);
  const [downloadLink, setDownloadLink] = useState('');
  const [editionlessIsOn, setEditionlessIsOn] = useState(false);
  const [headers, setHeaders] = useState(initialHeaders);
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
  }, [data?.results, data?.recordCount, isError, isLoading, analytics]);

  useEffect(() => {
    if (data?.recordCount > 0 && pageNumber > 0 && data?.results?.length === 0) {
      setPageNumber(0);
    }
  }, [data?.recordCount, pageNumber, data?.results?.length]);

  useEffect(() => {
    setDownloadLink(`${API}/certified_products/sed_details?api_key=${authService.getApiKey()}`);
  }, [API, authService]);

  useEffect(() => {
    setEditionlessIsOn(isOn('editionless'));
  }, [isOn]);

  useEffect(() => {
    if (!editionlessIsOn) { return; }
    setHeaders((prev) => prev.filter((header) => header.text !== 'Certification Edition'));
  }, [editionlessIsOn]);

  const handleTableSort = (event, property, orderDirection) => {
    $analytics.eventTrack('Sort', { category: analytics.category, label: property });
    setOrderBy(property);
    setSortDescending(orderDirection === 'desc');
  };

  const viewDetails = (id) => {
    $uibModal.open({
      templateUrl: 'chpl.collections/sed/sed-modal.html',
      controller: 'ViewSedModalController',
      controllerAs: 'vm',
      animation: false,
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      resolve: {
        id() { return id; },
      },
    });
  };

  const pageStart = (pageNumber * pageSize) + 1;
  const pageEnd = Math.min((pageNumber + 1) * pageSize, recordCount);

  return (
    <>
      <div className={classes.pageHeader}>
        { editionlessIsOn ? (
          <Typography variant="h1">SED Information</Typography>
        ) : (
          <Typography variant="h1">SED Information for 2015 Edition Products</Typography>
        )}
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <div>
          { editionlessIsOn ? (
            <Typography variant="body1">
              This list includes all health IT products that have been certified with Safety Enhanced Design (SED).
            </Typography>
          ) : (
            <Typography variant="body1">
              This list includes all 2015 Edition, including Cures Update, health IT products that have been certified with Safety Enhanced Design (SED).
            </Typography>
          )}
          <Typography variant="body1">
            Please note that by default, only listings that are active or suspended are shown in the search results.
          </Typography>
        </div>
        <div>
          <h2>SED Information Dataset</h2>
          <Typography variant="body1" gutterBottom>
            Please note the All SED Details file contains information for all certified product listings and is not filtered based on search results.
          </Typography>
          <ChplLink
            href={downloadLink}
            text="Download All SED Details"
            analytics={{ event: 'Download All SED Details', category: analytics.category }}
            external={false}
          />
        </div>
      </div>
      <div className={classes.searchContainer}>
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
                  />
                )}
            </div>
            { listings.length > 0
              && (
                <>
                  <TableContainer className={classes.tableContainer} component={Paper}>
                    <Table
                      stickyHeader
                      aria-label="SED Collections table"
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
                              { !editionlessIsOn
                                && (
                                  <TableCell>
                                    { item.edition
                                      ? (
                                        <>
                                          {item.edition.name}
                                          {' '}
                                          {item.curesUpdate ? 'Cures Update' : '' }
                                        </>
                                      ) : (
                                        <></>
                                      )}
                                  </TableCell>
                                )}
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
                              <TableCell>
                                <ChplActionButton
                                  listing={item}
                                >
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    size="small"
                                    id={`view-details-${item.id}`}
                                    onClick={() => viewDetails(item.id)}
                                    endIcon={<InfoIcon />}
                                  >
                                    View
                                  </Button>
                                </ChplActionButton>
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

export default ChplSedCollectionView;

ChplSedCollectionView.propTypes = {
  analytics: shape({
    category: string.isRequired,
  }).isRequired,
};
