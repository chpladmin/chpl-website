import React, { useEffect, useState } from 'react';
import { bool, func } from 'prop-types';
import {
  Button,
  Checkbox,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  ThemeProvider,
  makeStyles,
} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';

import { useFetchPendingListings, useFetchPendingListingsLegacy } from 'api/pending-listings';
import ChplSortableHeaders from 'components/util/chpl-sortable-headers';
import { getAngularService } from 'services/angular-react-helper';
import theme from 'themes/theme';

const useStyles = makeStyles(() => ({
  deleteButton: {
    backgroundColor: '#c44f65',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#853544',
    },
  },
  stickyColumn: {
    position: 'sticky',
    left: 0,
    boxShadow: 'rgba(149, 157, 165, 0.1) 0px 4px 8px',
    backgroundColor: '#ffffff',
    overflowWrap: 'anywhere',
    [theme.breakpoints.up('sm')]: {
      minWidth: '200px',
    },
  },
  tableContainer: {
    overflowWrap: 'normal',
    border: '.5px solid #c2c6ca',
    margin: '0px 32px',
    width: 'auto',
  },
  rejectFooter: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '16px 32px',
  },
  wrap: {
    overflowWrap: 'anywhere',
  },
}));

const getStatus = (listing, beta, classes) => {
  if ((beta && listing.status === 'UPLOAD_PROCESSING') || (!beta && listing.processing)) {
    return <CircularProgress />;
  }
  if (listing.status === 'UPLOAD_FAILURE') {
    return (
      <Chip
        label="Processing error"
        className={classes.deleteButton}
      />
    );
  }
  return (
    <>
      {`${listing.errorCount} error${listing.errorCount !== 1 ? 's' : ''}`}
      <br />
      {`${listing.warningCount} warning${listing.warningCount !== 1 ? 's' : ''}`}
    </>
  );
};

const canProcess = (listing, beta) => ((beta && listing.status === 'UPLOAD_SUCCESS') || (!beta && !listing.processing));

function ChplConfirmListings(props) {
  const { beta } = props;
  const DateUtil = getAngularService('DateUtil');
  const networkService = getAngularService('networkService');
  const toaster = getAngularService('toaster');
  const { data } = useFetchPendingListingsLegacy();
  const { data: betaData } = useFetchPendingListings();
  const [idsToReject, setIdsToReject] = useState([]);
  const [listings, setListings] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    let updated;
    if (beta) {
      updated = betaData || [];
    } else {
      updated = data || [];
    }
    setListings(updated.map((listing) => ({
      ...listing,
      displayStatus: getStatus(listing, beta, classes),
      canProcess: canProcess(listing, beta),
    })));
  }, [data, betaData, beta, classes]);

  const handleProcess = (listing) => {
    props.onProcess(listing.id, beta);
  };

  const handleRejectOriginal = () => {
    networkService.massRejectPendingListings(idsToReject)
      .then(() => {
        setIdsToReject([]);
        // loadListings();
      }, (error) => {
        let message = `Rejection of ${idsToReject.length} listing${idsToReject.length !== 1 ? 's' : ''} failed`;
        if (error?.data?.errorMessages) {
          message += `. ${error.data.errorMessages.join(', ')}`;
        }
        if (error?.data?.error) {
          message += `. ${error.data.error}`;
        }
        toaster.pop({
          type: 'error',
          title: 'Error',
          body: message,
        });
      });
  };

  const handleRejectBeta = () => {
    networkService.massRejectPendingListingsBeta(idsToReject)
      .then(() => {
        setIdsToReject([]);
        // loadListings();
      }, (error) => {
        let message = `Rejection of ${idsToReject.length} listing${idsToReject.length !== 1 ? 's' : ''} failed`;
        if (error?.data?.errorMessages) {
          message += `. ${error.data.errorMessages.join(', ')}`;
        }
        if (error?.data?.error) {
          message += `. ${error.data.error}`;
        }
        toaster.pop({
          type: 'error',
          title: 'Error',
          body: message,
        });
      });
  };

  const handleReject = () => {
    if (beta) {
      handleRejectBeta();
    } else {
      handleRejectOriginal();
    }
  };

  const handleRejectCheckbox = ($event, listing) => {
    if ($event.target.checked) {
      setIdsToReject([...idsToReject, listing.id]);
    } else {
      setIdsToReject(idsToReject.filter((id) => id !== listing.id));
    }
  };

  const listingSortComparator = (property) => {
    let sortOrder = 1;
    let key = property;
    if (key[0] === '-') {
      sortOrder = -1;
      key = key.substr(1);
    }
    return (a, b) => {
      const result = (a[key] < b[key]) ? -1 : 1;
      return result * sortOrder;
    };
  };

  const handleTableSort = (event, property, orderDirection) => {
    setListings(listings.map((listing) => listing).sort(listingSortComparator(orderDirection + property)));
  };

  const headers = beta ? [
    { text: 'Action', invisible: true },
    { text: 'CHPL Product Number', property: 'chplProductNumber', sortable: true },
    { text: 'Developer', property: 'developer', sortable: true },
    { text: 'Product', property: 'product', sortable: true },
    { text: 'Version', property: 'version', sortable: true },
    { text: 'Certification Date', property: 'certificationDate', sortable: true },
    { text: 'Status' },
    { text: 'Reject Listing', invisible: true },
  ] : [
    { text: 'Action', invisible: true },
    { text: 'CHPL Product Number' },
    { text: 'Developer' },
    { text: 'Product' },
    { text: 'Version' },
    { text: 'Certification Date' },
    { text: 'Status' },
    { text: 'Reject Listing', invisible: true },
  ];

  if (listings.length === 0) {
    return (
      <div>No products currently in queue</div>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.rejectFooter}>
        <Button
          id="reject-selected-pending-listings"
          className={classes.deleteButton}
          variant="contained"
          onClick={handleReject}
          startIcon={<DeleteIcon />}
          disabled={idsToReject.length === 0}
        >
          Reject
          {' '}
          {(idsToReject.length > 0) ? idsToReject.length : ''}
          {' '}
          selected
        </Button>
      </div>
      <TableContainer className={classes.tableContainer} component={Paper}>
        <Table>
          <ChplSortableHeaders
            headers={headers}
            onTableSort={handleTableSort}
          />
          <TableBody>
            { listings
              .map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className={classes.stickyColumn}>
                    <Button
                      id={`process-pending-listing-${listing.chplProductNumber}`}
                      color="primary"
                      variant="contained"
                      onClick={() => handleProcess(listing)}
                      endIcon={<PlayArrowIcon />}
                      disabled={!listing.canProcess}
                    >
                      Process Listing
                    </Button>
                  </TableCell>
                  <TableCell className={classes.wrap}>{listing.chplProductNumber}</TableCell>
                  <TableCell className={classes.wrap}>{beta ? listing.developer : listing.developer.name}</TableCell>
                  <TableCell className={classes.wrap}>{beta ? listing.product : listing.product.name}</TableCell>
                  <TableCell className={classes.wrap}>{beta ? listing.version : listing.version.version}</TableCell>
                  <TableCell className={classes.wrap}>{DateUtil.getDisplayDateFormat(listing.certificationDate)}</TableCell>
                  <TableCell>{ listing.displayStatus }</TableCell>
                  <TableCell>
                    <Checkbox
                      id={`reject-pending-listing-${listing.chplProductNumber}`}
                      onChange={($event) => handleRejectCheckbox($event, listing)}
                      inputProps={{ 'aria-label': `Reject Listing: ${listing.chplProductNumber}` }}
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ThemeProvider>
  );
}

export default ChplConfirmListings;

ChplConfirmListings.propTypes = {
  beta: bool,
  onProcess: func.isRequired,
};

ChplConfirmListings.defaultProps = {
  beta: false,
};
