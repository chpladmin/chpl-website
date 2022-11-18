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

import { useFetchListings } from 'api/cms-lookup';
import {
  ChplLink,
  ChplPagination,
} from 'components/util';
import { ChplSortableHeaders } from 'components/util/sortable-headers';
import { getAngularService } from 'services/angular-react-helper';
import { getDisplayDateFormat } from 'services/date-util';
import { useLocalStorage as useStorage } from 'services/storage.service';
import { palette, theme } from 'themes';

const csvOptions = {
  filename: 'cms-id-data',
  showLabels: true,
  headers: [
    { headerName: 'CHPL ID', objectKey: 'chplProductNumber' },
    { headerName: 'Certification Edition', objectKey: 'fullEdition' },
    { headerName: 'Developer', objectKey: 'developerName' },
    { headerName: 'Product', objectKey: 'productName' },
    { headerName: 'Version', objectKey: 'versionName' },
    { headerName: 'Certification Status', objectKey: 'certificationStatusName' },
    { headerName: 'Decertification Date', objectKey: 'decertificationDate' },
  ],
};

const headers = [
  { text: 'CMS EHR Certification ID' },
  { text: 'CMS EHR Certification ID Edition' },
  { text: 'Product Name' },
  { text: 'Version' },
  { text: 'Developer' },
  { text: 'CHPL Product Number' },
  { text: 'Product Certification Edition' },
  { text: 'Classification Type' },
  { text: 'Practice Type' },
];

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

function ChplCmsLookup(props) {
  const storageKey = 'storageKey-cmsLookupIds';
  const $analytics = getAngularService('$analytics');
  const csvExporter = new ExportToCsv(csvOptions);
  const [listings, setListings] = useState([]);
  const [cmsIds, setCmsIds] = useStorage(storageKey, []);
  const classes = useStyles();

  const { data, isError, isLoading } = useFetchListings({ cmsIds });

  useEffect(() => {
    if (isLoading) { return; }
    if (isError || !data.results) {
      setListings([]);
      return;
    }
    setListings(data.results.map((listing) => ({
      ...listing,
    })));
  }, [data?.results, data?.recordCount, isError, isLoading]);

  const downloadListingData = () => {
    $analytics.eventTrack('Download Results', { category: analytics.category, label: listings.length });
    csvExporter.generateCsv(listings);
  };

  return (
    <>
      <div className={classes.pageHeader}>
        <Typography variant="h1">CMS ID Reverse Lookup</Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <Typography variant="h2">Lookup CMS EHR Certification IDs</Typography>
        <Typography variant="body1">
          Use the box below to determine which products were used to create a specific CMS EHR Certification ID. Enter one or more CMS EHR Certification IDs to display the products which were used to create the associated CMS EHR Certification ID.
        </Typography>
      </div>
      { isLoading
        && (
          <>Loading</>
        )}
      { !isLoading
        && (
          <>
            <div className={classes.tableResultsHeaderContainer}>
              { listings.length > 0
                && (
                  <ButtonGroup size="small" className={classes.wrap}>
                    <Button
                      color="secondary"
                      variant="contained"
                      fullWidth
                      id="download-listing-data"
                      onClick={downloadListingData}
                      endIcon={<GetAppIcon />}
                    >
                      Download Result
                      { listings.length !== 1 ? 's' : '' }
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
                      aria-label="CMS Id Listing Data table"
                    >
                      <ChplSortableHeaders
                        headers={headers}
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
                              <TableCell>{item.certificationStatus.name}</TableCell>
                              <TableCell>{getDisplayDateFormat(item.decertificationDate)}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
          </>
        )}
    </>
  );
}

export default ChplCmsLookup;

ChplCmsLookup.propTypes = {
};
