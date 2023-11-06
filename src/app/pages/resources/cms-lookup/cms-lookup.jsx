import React, { useContext, useEffect, useState } from 'react';
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
import { getAngularService } from 'services/angular-react-helper';
import { useLocalStorage as useStorage } from 'services/storage.service';
import { FlagContext } from 'shared/contexts';
import { palette } from 'themes';

const initialCsvOptions = {
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

const initialHeaders = initialCsvOptions.headers.map((h) => ({ text: h.headerName }));

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
  const $analytics = getAngularService('$analytics');
  const { isOn } = useContext(FlagContext);
  const [csvOptions, setCsvOptions] = useState(initialCsvOptions);
  const [editionlessIsOn, setEditionlessIsOn] = useState(false);
  const [errors, setErrors] = useState([]);
  const [headers, setHeaders] = useState(initialHeaders);
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

  useEffect(() => {
    setEditionlessIsOn(isOn('editionless'));
    if (isOn('editionless')) {
      setCsvOptions((prev) => ({
        ...prev,
        headers: prev.headers.filter((header) => header.objectKey !== 'edition'),
      }));
      setHeaders((prev) => prev.filter((header) => header.text !== 'Product Certification Edition'));
    }
  }, [isOn]);

  const downloadListingData = () => {
    $analytics.eventTrack('Download Results', { category: 'CMS ID Reverse Lookup' });
    const csvExporter = new ExportToCsv({
      ...csvOptions,
      filename: `CMS_ID.${cmsIds.join('.')}`,
    });
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
                            analytics={{ event: 'Go to Listing Details Page', category: 'CMS ID Reverse Lookup', label: item.chplProductNumber }}
                            external={false}
                            router={{ sref: 'listing', options: { id: item.id } }}
                          />
                        </TableCell>
                        { !editionlessIsOn
                          && <TableCell>{ item.edition }</TableCell>}
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
