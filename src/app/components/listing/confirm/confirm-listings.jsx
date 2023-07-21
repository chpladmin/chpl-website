import React, { useEffect, useState } from 'react';
import { func } from 'prop-types';
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
  makeStyles,
} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DeleteIcon from '@material-ui/icons/Delete';
import CircularProgress from '@material-ui/core/CircularProgress';
import FeedbackIcon from '@material-ui/icons/Feedback';

import {
  useFetchPendingListing,
  useFetchPendingListings,
  useRejectPendingListing,
} from 'api/pending-listings';
import ChplActionBarMessages from 'components/action-bar/action-bar-messages';
import ChplSortableHeaders from 'components/util/chpl-sortable-headers';
import { getAngularService } from 'services/angular-react-helper';
import theme from 'themes/theme';

const useStyles = makeStyles({
  deleteButton: {
    backgroundColor: '#c44f65',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#853544',
    },
  },
  iconSpacing: {
    marginLeft: '4px',
  },
  messageButton: {
    marginLeft: '-8px',
    textTransform: 'none',
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
});

const getStatus = (listing, classes) => {
  if (listing.status === 'UPLOAD_PROCESSING') {
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

function ChplConfirmListings(props) {
  const DateUtil = getAngularService('DateUtil');
  const toaster = getAngularService('toaster');
  const [errors, setErrors] = useState([]);
  const [idsToReject, setIdsToReject] = useState([]);
  const [listingIdToLoad, setListingIdToLoad] = useState(undefined);
  const [listings, setListings] = useState([]);
  const [warnings, setWarnings] = useState([]);
  const { data: modernData } = useFetchPendingListings();
  const { data: processingListing } = useFetchPendingListing({ id: listingIdToLoad });
  const { mutate: rejectListing } = useRejectPendingListing();
  const classes = useStyles();

  useEffect(() => {
    if (!processingListing?.id || listings.length === 0) { return; }
    const updated = listings.find((listing) => listing.id === processingListing.id);
    let nextListing;
    if (updated) {
      const updatedListings = listings
        .filter((listing) => listing.id !== updated.id)
        .concat({
          ...updated,
          errors: processingListing.errorMessages,
          warnings: processingListing.warningMessages,
        })
        .sort((a, b) => (a.chplProductNumber < b.chplProductNumber ? -1 : 1));
      setListings(updatedListings);
      nextListing = updatedListings.find((listing) => listing.errors === undefined && listing.status !== 'UPLOAD_PROCESSING')?.id;
    } else {
      nextListing = listings.find((listing) => listing.errors === undefined && listing.status !== 'UPLOAD_PROCESSING')?.id;
    }
    setListingIdToLoad(nextListing);
  }, [processingListing]);

  useEffect(() => {
    if (!modernData) { return; }
    const updated = modernData
      .map((listing) => ({
        ...listing,
        displayStatus: getStatus(listing, classes),
      }))
      .sort((a, b) => (a.chplProductNumber < b.chplProductNumber ? -1 : 1));
    setListings(updated);
    const nextListing = updated.find((l) => l.errors === undefined && l.status !== 'UPLOAD_PROCESSING')?.id;
    if (nextListing) {
      setListingIdToLoad(nextListing);
    }
  }, [modernData, classes]);

  const handleProcess = (listing) => {
    props.onProcess(listing.id);
  };

  const handleRejectActual = (reject) => {
    idsToReject.forEach((id) => {
      reject(id, {
        onError: (error) => {
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
        },
      });
    });
    setIdsToReject([]);
  };

  const handleReject = () => {
    handleRejectActual(rejectListing);
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

  const headers = [
    { text: 'Action', invisible: true },
    { text: 'CHPL Product Number', property: 'chplProductNumber', sortable: true },
    { text: 'Developer', property: 'developer', sortable: true },
    { text: 'Product', property: 'product', sortable: true },
    { text: 'Version', property: 'version', sortable: true },
    { text: 'Certification Date', property: 'certificationDate', sortable: true },
    { text: 'Status' },
    { text: 'Reject Listing', invisible: true },
  ];

  return (
    <>
      { listings.length === 0
        && (
          <div>No products currently in queue</div>
        )}
      { listings.length > 0
        && (
          <>
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
                            disabled={listing.status !== 'UPLOAD_SUCCESS'}
                          >
                            Process Listing
                          </Button>
                        </TableCell>
                        <TableCell className={classes.wrap}>{listing.chplProductNumber}</TableCell>
                        <TableCell className={classes.wrap}>{listing.developer}</TableCell>
                        <TableCell className={classes.wrap}>{listing.product}</TableCell>
                        <TableCell className={classes.wrap}>{listing.version}</TableCell>
                        <TableCell className={classes.wrap}>{DateUtil.getDisplayDateFormat(listing.certificationDate)}</TableCell>
                        <TableCell>
                          { listing.displayStatus }
                          { listing.status !== 'UPLOAD_FAILURE' && (listing.errors?.length !== 0 || listing.warnings?.length !== 0)
                            && (
                              <div>
                                <Button
                                  onClick={() => { setErrors(listing.errors); setWarnings(listing.warnings); }}
                                  disabled={!(listing.errors?.length !== 0 || listing.warnings?.length !== 0)}
                                  variant="text"
                                  color="primary"
                                  className={classes.messageButton}
                                >
                                  See messages
                                  {' '}
                                  <FeedbackIcon color="primary" fontSize="small" className={classes.iconSpacing} />
                                </Button>
                              </div>
                            )}
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            id={`reject-pending-listing-${listing.chplProductNumber}`}
                            onChange={($event) => handleRejectCheckbox($event, listing)}
                            inputProps={{ 'aria-label': `Reject Listing: ${listing.chplProductNumber}` }}
                            color="primary"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <ChplActionBarMessages
              errors={errors}
              warnings={warnings}
            />
          </>
        )}
    </>
  );
}

export default ChplConfirmListings;

ChplConfirmListings.propTypes = {
  onProcess: func.isRequired,
};
