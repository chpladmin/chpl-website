import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  List,
  ListItem,
  ListItemIcon,
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
import WarningIcon from '@material-ui/icons/Warning';
import { ExportToCsv } from 'export-to-csv';

import { useFetchListings } from 'api/cms';
import ChplChips from 'components/cms/chips';
import ChplSearchTerm from 'components/cms/search-term';
import { ChplLink } from 'components/util';
import { ChplSortableHeaders } from 'components/util/sortable-headers';
import { eventTrack } from 'services/analytics.service';
import { useLocalStorage as useStorage } from 'services/storage.service';
import { useAnalyticsContext } from 'shared/contexts';
import { palette } from 'themes';

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
  ],
};

const headers = csvOptions.headers.map((h) => ({ text: h.headerName }));

const useStyles = makeStyles({
  pageHeader: {
    padding: '32px',
    backgroundColor: palette.white,
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
    display: 'flex',
    margin: '16px 32px',
    justifyContent: 'flex-end',
  },
  errorListIcon: {
    paddingLeft: '20px',
    paddingRight: '16px',
    minWidth: 'auto',
  },
  wrap: {
    flexFlow: 'wrap',
  },
});

function ChplCmsLookup() {
  const storageKey = 'storageKey-cmsLookupIds';
  const analytics = {
    ...useAnalyticsContext().analytics,
    category: 'CMS ID Reverse Lookup',
  };
  const [errors, setErrors] = useState([]);
  const [listings, setListings] = useState([]);
  const [cmsIds, setCmsIds] = useStorage(storageKey, []);
  const queries = useFetchListings({ cmsIds });
  const classes = useStyles();

  const finishedLoading = queries.every((query) => !query.isLoading);

  useEffect(() => {
    setListings(() => queries
      .filter((query) => query.isSuccess && query.data)
      .reduce((items, query) => items.concat(query.data.products.map((listing) => ({
        ...listing,
        certificationId: query.data.ehrCertificationId,
        certificationIdEdition: query.data.year,
        edition: listing.year !== null ? `${listing.year}${listing.curesUpdate ? ' Cures Update' : ''}` : '',
      }))), []));
    setErrors(() => queries
      .filter((query) => query.isError)
      .reduce((msgs, query) => msgs.concat(`The CMS ID "${query.error.config.url.split('/')[2]}" is invalid, or not found`, []), []));
  }, [cmsIds, finishedLoading]);

  const downloadListingData = () => {
    eventTrack({
      ...analytics,
      event: 'Download Results',
    });
    const csvExporter = new ExportToCsv({
      ...csvOptions,
      filename: `CMS_ID.${cmsIds.join('.')}`,
    });
    csvExporter.generateCsv(listings);
  };

  const handleDispatch = ({ action, payload }) => {
    switch (action) {
      case 'remove':
        eventTrack({
          ...analytics,
          event: 'Remove CMS ID Chip',
          label: payload.trim(),
        });
        setCmsIds((previous) => previous.filter((id) => id !== payload));
        setListings((previous) => previous.filter((listing) => listing.certificationId !== payload));
        break;
      case 'search':
        eventTrack({
          ...analytics,
          event: 'Lookup CMS ID',
          label: payload.trim(),
        });
        setCmsIds((previous) => [...new Set(previous.concat(payload.trim()))]);
        break;
        // no default
    }
  };

  return (
    <Container maxWidth="lg">
      <div className={classes.pageHeader}>
        <Typography variant="h1">CMS ID Reverse Lookup</Typography>
      </div>
      <div className={classes.pageBody} id="main-content" tabIndex="-1">
        <Typography variant="h2">Lookup CMS EHR Certification IDs</Typography>
        <Typography variant="body1">
          Use the box below to determine which products were used to create a specific CMS EHR Certification ID. Enter a CMS EHR Certification ID to display the products which were used to create the associated CMS EHR Certification ID. Additional IDs may be added individually.
        </Typography>
      </div>
      <ChplSearchTerm
        dispatch={handleDispatch}
      />
      <ChplChips
        cmsIds={cmsIds}
        dispatch={handleDispatch}
      />
      { errors.length > 0
        && (
          <Box>
            <List>
              { errors
                .map((msg) => (
                  <ListItem key={msg}>
                    <ListItemIcon className={classes.errorListIcon}>
                      <WarningIcon color="error" />
                    </ListItemIcon>
                    {msg}
                  </ListItem>
                ))}
            </List>
          </Box>
        )}
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
                            analytics={{
                              ...analytics,
                              event: 'Go to Listing Details Page',
                              label: item.chplProductNumber,
                              aggregationName: item.name,
                            }}
                            external={false}
                            router={{ sref: 'listing', options: { id: item.id } }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
    </Container>
  );
}

export default ChplCmsLookup;

ChplCmsLookup.propTypes = {
};
