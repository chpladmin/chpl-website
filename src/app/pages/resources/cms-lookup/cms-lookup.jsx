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
  { headerName: 'CMS EHR Certification ID', objectKey: '' },
  { headerName: 'CMS EHR Certification ID Edition', objectKey: '' },
  { headerName: 'Product Name', objectKey: '' },
  { headerName: 'Version', objectKey: '' },
  { headerName: 'Developer', objectKey: '' },
  { headerName: 'CHPL Product Number', objectKey: '' },
  { headerName: 'Product Certification Edition', objectKey: '' },
  ],
};

const headers = csvOptions.headers.map((h) => ({text: h.headerName}));

const useStyles = makeStyles({
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
  const [cmsId, setCmsId] = useState('');
  const { data, isError, isLoading } = useFetchListings({ cmsId });
  const classes = useStyles();

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
    $analytics.eventTrack('Download Results', { category: 'CMS ID Reverse Lookup' });
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
                      aria-label="CMS ID Listing Data table"
                    >
                      <ChplSortableHeaders
                        headers={headers}
                        stickyHeader
                      />
                      <TableBody>
                        { listings
                          .map((item) => (
                            <TableRow key={item.id}>
                              <TableCell>{ item.certificationId }</TableCell>
                              <TableCell>{ item.certificationIdEdition }</TableCell>
                              <TableCell>{ item.name }</TableCell>
                              <TableCell>{ item.version }</TableCell>
                              <TableCell>{ item.vendor }</TableCell>
                              <TableCell>
                                <ChplLink
                                  href={`#/listing/${item.id}`}
                                  text={item.chplProductNumber}
                                  analytics={{ event: 'Go to Listing Details Page', category: 'CMS ID Reverse Lookup', label: item.chplProductNumber }}
                                  external={false}
                                  router={{ sref: 'listing', options: { id: item.id } }}
                                />
                              </TableCell>
                              <TableCell>
                                { item.year }
                                {' '}
                                {item.curesUpdate ? 'Cures Update' : ''}
                              </TableCell>
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
