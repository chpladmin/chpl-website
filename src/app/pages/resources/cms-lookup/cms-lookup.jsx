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
import GetAppIcon from '@material-ui/icons/GetApp';
import { ExportToCsv } from 'export-to-csv';

import { useFetchListings } from 'api/cms';
import ChplChips from 'components/cms/chips';
import ChplSearchTerm from 'components/cms/search-term';
import { ChplLink } from 'components/util';
import { ChplSortableHeaders } from 'components/util/sortable-headers';
import { getAngularService } from 'services/angular-react-helper';
import { useLocalStorage as useStorage } from 'services/storage.service';
import { theme } from 'themes';

const csvOptions = {
  filename: 'cms-id-data',
  showLabels: true,
  headers: [
    { headerName: 'CMS EHR Certification ID', objectKey: 'certificationId' },
    { headerName: 'CMS EHR Certification ID Edition', objectKey: 'certificationIdEdition' },
    { headerName: 'Product Name', objectKey: 'name' },
    { headerName: 'Version', objectKey: 'version' },
    { headerName: 'Developer', objectKey: 'vendor' },
    { headerName: 'CHPL Product Number', objectKey: 'chplProductNumber' },
    { headerName: 'Product Certification Edition', objectKey: 'edition' },
  ],
};

const headers = csvOptions.headers.map((h) => ({ text: h.headerName }));

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

function ChplCmsLookup() {
  const storageKey = 'storageKey-cmsLookupIds';
  const $analytics = getAngularService('$analytics');
  const csvExporter = new ExportToCsv(csvOptions);
  const [listings, setListings] = useState([]);
  const [cmsIds, setCmsIds] = useStorage(storageKey, []);
  const queries = useFetchListings({ cmsIds });
  const classes = useStyles();

  const finishedLoading = queries.every((query) => query.isSuccess);

  useEffect(() => {
    if (queries.some((query) => query.isLoading || query.isError || !query?.data)) { return; }
    setListings(() => queries.reduce((items, query) => items.concat(query.data.products.map((listing) => ({
      ...listing,
      certificationId: query.data.ehrCertificationId,
      certificationIdEdition: query.data.year,
      edition: `${listing.year}${listing.curesUpdate ? ' Cures Update' : ''}`,
    }))), []));
  }, [cmsIds, finishedLoading]);

  const downloadListingData = () => {
    $analytics.eventTrack('Download Results', { category: 'CMS ID Reverse Lookup' });
    csvExporter.generateCsv(listings);
  };

  const handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'remove':
        setCmsIds((previous) => previous.filter((id) => id !== payload));
        setListings((previous) => previous.filter((listing) => listing.certificationId !== payload));
        break;
      case 'search':
        $analytics.eventTrack('Lookup CMS EHR Certification IDs', { category: 'CMS ID Reverse Lookup' });
        setCmsIds((previous) => [...new Set(previous.concat(payload.trim()))]);
        break;
        // no default
    }
  };

  return (
    <>
      <div className={classes.pageHeader}>
        <Typography variant="h1">CMS ID Reverse Lookup</Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <Typography variant="h2">Lookup CMS EHR Certification IDs</Typography>
        <Typography variant="body1">
          Use the box below to determine which products were used to create a specific CMS EHR Certification ID. Enter a CMS EHR Certification ID to display the products which were used to create the associated CMS EHR Certification ID.
        </Typography>
      </div>
      <ChplSearchTerm
        dispatch={handleDispatch}
      />
      <ChplChips
        cmsIds={cmsIds}
        dispatch={handleDispatch}
      />
      { listings.length > 0
        && (
          <>
            <div className={classes.tableResultsHeaderContainer}>
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
            </div>
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
                      <TableRow key={`${item.certificationId}-${item.id}`}>
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
                        <TableCell>{ item.edition }</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
    </>
  );
}

export default ChplCmsLookup;

ChplCmsLookup.propTypes = {
};
